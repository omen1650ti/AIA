"""PostgreSQL based checkpointer for LangGraph agent state persistence using psycopg."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator, Optional
import logging

from psycopg.rows import dict_row
from psycopg_pool import AsyncConnectionPool
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver

from app.core.config import settings

logger = logging.getLogger(__name__)


class AsyncPostgresPool:
    """Singleton-like pool manager for async PostgreSQL connections using psycopg."""
    
    _pool: Optional[AsyncConnectionPool] = None

    @classmethod
    async def initialize(
        cls,
        dsn: Optional[str] = None,
        min_size: int = 1,
        max_size: int = 10,
    ) -> None:
        """Initialize the connection pool if not already initialized.
        
        Creates a new AsyncConnectionPool with specified connection limits.
        Automatically converts SQLAlchemy-style URLs to psycopg DSN format.
        Safe to call multiple times; only initializes once.
        
        Args:
            dsn: PostgreSQL connection string. If None, uses settings.DATABASE_URL.
                 Supports both SQLAlchemy format (postgresql+asyncpg://...) and
                 plain psycopg format (postgresql://...).
            min_size: Minimum number of connections to maintain in pool (default: 1)
            max_size: Maximum number of connections to create (default: 10)
        
        Returns:
            None
        
        Note:
            Connection pooling is configured with autocommit=True and
            dict_row factory for result convenience.
        """
        if cls._pool is None:
            dsn = dsn or settings.DATABASE_URL
            # Convert SQLAlchemy-style URL to psycopg DSN
            dsn = dsn.replace("postgresql+asyncpg://", "postgresql://") if "+asyncpg" in dsn else dsn
            
            cls._pool = AsyncConnectionPool(
                conninfo=dsn,
                min_size=min_size,
                max_size=max_size,
                kwargs={
                    "autocommit": True,
                    "row_factory": dict_row,
                },
            )
            logger.info(f"AsyncPostgresPool initialized with min_size={min_size}, max_size={max_size}")

    @classmethod
    def is_initialized(cls) -> bool:
        """Check if the connection pool has been initialized.
        
        Returns:
            True if pool exists and is ready, False otherwise
        """
        return cls._pool is not None

    @classmethod
    async def get_pool(cls) -> AsyncConnectionPool:
        """Retrieve the active connection pool.
        
        Returns:
            The initialized AsyncConnectionPool
        
        Raises:
            RuntimeError: If pool has not been initialized. Call initialize() first.
        """
        if cls._pool is None:
            raise RuntimeError(
                "AsyncPostgresPool is not initialized. Call initialize() first."
            )
        return cls._pool

    @classmethod
    @asynccontextmanager
    async def connection(cls) -> AsyncGenerator:
        """Context manager for retrieving a connection from the pool.
        
        Automatically manages connection lifecycle - acquires from pool
        on enter and returns on exit.
        
        Yields:
            A psycopg async connection object
        
        Raises:
            RuntimeError: If pool has not been initialized
        
        Example:
            async with AsyncPostgresPool.connection() as conn:
                result = await conn.execute("SELECT 1")
        """
        if cls._pool is None:
            raise RuntimeError(
                "AsyncPostgresPool is not initialized. Call initialize() first."
            )
        async with cls._pool.connection() as conn:
            yield conn

    @classmethod
    async def close_pool(cls) -> None:
        """Gracefully close the connection pool and cleanup resources.
        
        Closes all active and idle connections in the pool. Should be called
        on application shutdown to ensure proper cleanup.
        
        Safe to call even if pool is not initialized.
        """
        if cls._pool is not None:
            await cls._pool.close()
            cls._pool = None
            logger.info("AsyncPostgresPool closed")

async def get_postgres_saver() -> AsyncPostgresSaver:
    """Get or create a PostgreSQL checkpoint saver for LangGraph agent persistence.
    
    Initializes an AsyncPostgresPool if not already done, then creates and
    configures an AsyncPostgresSaver with the native LangGraph checkpointer.
    Automatically creates required database tables on first call.
    
    This should be called once during app startup to initialize the pool and
    memory saver, then the returned saver can be used with agent graphs.
    
    Returns:
        AsyncPostgresSaver configured with the PostgreSQL connection pool.
        Ready to use with agent graph.compile(checkpointer=memory).
    
    Raises:
        RuntimeError: If AsyncPostgresPool initialization fails or DB is unreachable
        Exception: If table setup fails
    
    Example:
        memory = await get_postgres_saver()
        supervisor = create_supervisor(...).compile(checkpointer=memory)
    """
    # Initialize pool if not already done
    if not AsyncPostgresPool.is_initialized():
        await AsyncPostgresPool.initialize()
    
    # Get pool and create a memory saver from it
    pool = await AsyncPostgresPool.get_pool()
    
    # Create the native LangGraph AsyncPostgresSaver with the psycopg pool
    memory = AsyncPostgresSaver(conn=pool)
    
    # Setup memory (creates tables if they don't exist)
    await memory.setup()
    
    return memory

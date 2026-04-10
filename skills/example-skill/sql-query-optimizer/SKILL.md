---
name: "sql-query-optimizer"
description: "Analyzes SQL queries for performance bottlenecks, suggests optimizations including indexing strategies, query rewrites, and execution plan improvements. Supports multiple database engines (PostgreSQL, MySQL, SQL Server, Oracle) with engine-specific recommendations."
version: "1.0.0"
tags: ["sql", "database", "performance", "optimization", "query-tuning", "indexing"]
context_priority: "high"
---

# SQL Query Optimizer

## When to Use This Skill

**Use this skill when:**
- You have slow-running SQL queries that need performance improvement
- You want to optimize queries before deploying to production
- You need to understand query execution plans and identify bottlenecks
- You want recommendations for indexing strategies
- You need to refactor complex queries for better readability and performance
- You are troubleshooting database performance issues or high CPU/IO usage
- You want to learn SQL optimization best practices

**Do NOT use this skill when:**
- You need to modify database schema or table structures directly
- You require actual execution statistics from a live database
- The query involves proprietary business logic that cannot be shared
- You need to perform capacity planning or hardware sizing

## Core Workflow

### Step 1: Query & Context Analysis
Parse and understand the input:
- The SQL query or query batch to optimize
- Database engine and version (PostgreSQL, MySQL, SQL Server, Oracle, etc.)
- Table schemas (columns, data types, existing indexes)
- Approximate table sizes (row counts)
- Current query performance metrics (execution time, rows examined, etc.)
- EXPLAIN/EXPLAIN ANALYZE output if available

Identify:
- Query type (SELECT, INSERT, UPDATE, DELETE, MERGE)
- Join types and complexity
- Subqueries, CTEs, or derived tables
- Aggregations, grouping, and sorting operations
- Filter conditions and predicates

### Step 2: Performance Bottleneck Detection
Analyze the query for common performance issues:

**Index-Related Issues:**
- Missing indexes on filtered or joined columns
- Inefficient index usage (index scans instead of seeks)
- Redundant or overlapping indexes
- Covering index opportunities
- Index selectivity problems

**Query Structure Issues:**
- N+1 query patterns
- Cartesian products from missing join conditions
- Non-SARGable predicates (functions on indexed columns)
- Implicit type conversions preventing index usage
- OR conditions that prevent index usage
- LIKE patterns with leading wildcards

**Execution Plan Issues:**
- Full table scans on large tables
- Expensive sort or hash operations
- Temp table or file sort usage
- High cardinality estimates vs. actual rows
- Nested loop joins on large datasets

**Resource Utilization:**
- Excessive memory grants
- High I/O operations
- CPU-intensive operations
- Lock contention potential

### Step 3: Optimization Strategy Formulation
Develop specific optimization recommendations:

**Index Recommendations:**
- Create new indexes with column order based on selectivity
- Suggest covering indexes to eliminate key lookups
- Recommend composite indexes for multi-column filters
- Identify indexes to drop or consolidate
- Provide CREATE INDEX statements

**Query Rewrite Suggestions:**
- Convert subqueries to JOINs where beneficial
- Replace OR with UNION for better index usage
- Simplify complex CASE expressions
- Optimize EXISTS vs. IN vs. JOIN choices
- Restructure CTEs for materialization control
- Push predicates closer to base tables

**Schema-Level Recommendations:**
- Partitioning strategies for large tables
- Denormalization opportunities
- Computed/persisted columns for expensive calculations
- Statistics update recommendations

**Engine-Specific Optimizations:**
- PostgreSQL: BRIN indexes, partial indexes, parallel query hints
- MySQL: Index hints, optimizer_switch settings, partition pruning
- SQL Server: Query store hints, forced parameterization, columnstore indexes
- Oracle: Hints, SQL profiles, result caching

### Step 4: Before/After Comparison
Provide:
- Original query with identified issues highlighted
- Optimized query with all changes applied
- Expected performance improvement estimate (% or x-factor)
- Trade-offs and considerations for each optimization
- Risks of the proposed changes

### Step 5: Implementation Guidance
Deliver actionable next steps:
- Priority-ordered list of changes to implement
- Index creation scripts ready to execute
- Testing strategy (how to validate improvements)
- Monitoring recommendations (what metrics to track)
- Rollback plan if optimizations cause issues
- When to involve a DBA or database architect

## Output Format

```json
{
  "analysis_summary": {
    "query_type": "SELECT|INSERT|UPDATE|DELETE|MERGE",
    "database_engine": "PostgreSQL|MySQL|SQL Server|Oracle|Other",
    "complexity_score": "low|medium|high",
    "estimated_current_cost": "relative cost estimate",
    "primary_bottlenecks": ["top 3-5 performance issues"],
    "tables_involved": [
      {
        "table_name": "string",
        "estimated_rows": "number or 'unknown'",
        "access_pattern": "full_scan|index_scan|seek",
        "issues": ["specific issues with this table"]
      }
    ]
  },
  "identified_issues": [
    {
      "id": "ISSUE-001",
      "category": "missing_index|non_sargable|full_scan|join_order|cardinality|other",
      "severity": "critical|high|medium|low",
      "location": "line number or clause description",
      "description": "detailed explanation of the issue",
      "impact": "performance consequence",
      "evidence": "query snippet or execution plan detail"
    }
  ],
  "optimizations": [
    {
      "id": "OPT-001",
      "type": "index_creation|query_rewrite|schema_change|configuration",
      "priority": "immediate|high|medium|low",
      "title": "short descriptive title",
      "description": "what change to make",
      "implementation": {
        "sql_script": "CREATE INDEX or rewritten query",
        "explanation": "why this works"
      },
      "expected_improvement": "estimated % or x-factor speedup",
      "trade_offs": ["write overhead, storage, maintenance"],
      "risk_level": "low|medium|high",
      "addresses_issues": ["ISSUE-001", "ISSUE-002"]
    }
  ],
  "optimized_query": {
    "full_query": "complete optimized SQL statement",
    "changes_made": [
      {
        "change": "description of modification",
        "reason": "why it improves performance",
        "line_reference": "original line or clause"
      }
    ],
    "alternative_approaches": [
      {
        "approach": "different optimization strategy",
        "when_to_use": "scenarios where this is better",
        "query_variant": "alternative SQL"
      }
    ]
  },
  "index_recommendations": {
    "create_indexes": [
      {
        "table": "table_name",
        "index_name": "idx_table_columns",
        "columns": ["col1", "col2"],
        "index_type": "btree|hash|covering|partial|columnstore",
        "create_statement": "full CREATE INDEX statement",
        "rationale": "why this index helps",
        "estimated_size": "approximate size if known"
      }
    ],
    "drop_indexes": [
      {
        "index_name": "idx_to_drop",
        "table": "table_name",
        "reason": "why it should be removed"
      }
    ],
    "modify_indexes": [
      {
        "index_name": "idx_to_modify",
        "recommended_change": "add/remove/reorder columns"
      }
    ]
  },
  "testing_plan": {
    "before_metrics": ["metrics to capture before change"],
    "after_metrics": ["metrics to capture after change"],
    "test_scenarios": ["test cases to run"],
    "rollback_steps": ["how to revert if needed"]
  },
  "additional_recommendations": [
    {
      "category": "statistics|partitioning|caching|architecture",
      "recommendation": "suggestion",
      "priority": "immediate|short-term|long-term",
      "effort": "S|M|L"
    }
  ]
}
```

## Fallback Behavior

**If table schemas are not provided:**
- Make reasonable assumptions based on column names
- Note assumptions clearly in the analysis
- Provide general optimization principles that apply broadly
- Request schema information for more specific recommendations

**If database engine is unknown:**
- Provide ANSI SQL optimizations that work across engines
- Note engine-specific features that could help if identified
- Ask user to specify their database system

**If EXPLAIN output is not available:**
- Analyze the query structure statically
- Predict likely execution plan issues
- Recommend capturing EXPLAIN output for deeper analysis
- Provide heuristics-based optimization suggestions

**If query is already well-optimized:**
- Confirm that the query follows best practices
- Suggest monitoring and baseline establishment
- Recommend indexing review if not recently done
- Propose application-level optimizations (caching, batching)

**If the query is too complex for single-pass optimization:**
- Break down into logical components
- Optimize each component separately
- Suggest incremental optimization approach
- Recommend profiling individual operations

## Examples

### Example Input:
```sql
-- Database: PostgreSQL 14
-- Table users: ~1M rows, Table orders: ~50M rows
SELECT u.name, u.email, COUNT(o.id) as order_count, SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE YEAR(o.created_at) = 2023
AND u.status = 'active'
GROUP BY u.id, u.name, u.email
HAVING SUM(o.total) > 1000
ORDER BY total_spent DESC
LIMIT 100;
```

### Example Issues Identified:
1. **Non-SARGable predicate:** `YEAR(o.created_at) = 2023` prevents index usage
2. **Missing index:** No index on `orders(user_id, created_at, total)`
3. **Missing index:** No index on `users(status)`
4. **Inefficient aggregation:** Computing aggregates on large dataset before filtering

### Example Optimized Query:
```sql
SELECT u.name, u.email, COUNT(o.id) as order_count, SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id 
    AND o.created_at >= '2023-01-01' 
    AND o.created_at < '2024-01-01'
WHERE u.status = 'active'
GROUP BY u.id, u.name, u.email
HAVING SUM(o.total) > 1000
ORDER BY total_spent DESC
LIMIT 100;

-- Recommended indexes:
CREATE INDEX idx_orders_user_created_total ON orders(user_id, created_at, total);
CREATE INDEX idx_users_status ON users(status) WHERE status = 'active';
```

---
name: remove-function-optimization

description: |
  A skill to optimize and secure the `remove` function in a MySQL utility file. This skill ensures safety, readability, and debugging ease by adding validation, logging, and structured returns.

argument-hint: What should this skill optimize?

disable-model-invocation: false
---

## Purpose
This skill focuses on improving the `remove` function in a MySQL utility file. It ensures:
- Safety: Prevents accidental full-table deletions.
- Security: Validates table names to avoid SQL injection.
- Debugging: Enhances error logging with SQL and parameter context.
- Usability: Provides structured and user-friendly return values.

## Workflow
1. **Validate Input**:
   - Ensure `where` is not empty.
   - Check if `table` is in an allowed whitelist.

2. **Build SQL**:
   - Construct the `WHERE` clause from `where` keys.
   - Generate the parameterized SQL query.

3. **Execute Query**:
   - Use `pool.execute` to run the query with parameters.
   - Catch and log errors with SQL and parameter details.

4. **Return Results**:
   - Return a structured object with `affectedRows` and a success message.

## Example Prompts
- "Optimize the `remove` function for safety and debugging."
- "Add validation and logging to the MySQL `remove` function."

## Completion Criteria
- The function rejects empty `where` conditions.
- Only whitelisted table names are allowed.
- Errors include SQL and parameter context.
- The return value is a structured object with clear fields.

## Related Customizations
- Create a similar skill for `update` and `insert` functions.
- Develop a skill for general SQL query validation and logging.
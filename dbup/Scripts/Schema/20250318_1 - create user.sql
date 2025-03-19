create user "$ServiceUserName$" with password '$ServicePassword$';
alter default privileges grant usage on schemas to "$ServiceUserName$";
alter default privileges grant select, insert, update, delete on tables to "$ServiceUserName$";
alter default privileges grant usage, select, update on sequences to "$ServiceUserName$";
alter default privileges grant execute on functions to "$ServiceUserName$";

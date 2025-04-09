create schema budget;
drop schema public;
create user "$ServiceUserName$" with password '$ServicePassword$';
grant usage on schema budget to "$ServiceUserName$";

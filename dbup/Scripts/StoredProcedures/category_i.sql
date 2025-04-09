create or replace function budget.category_i (
	p_name text
)
returns table (
	id int
)
language plpgsql security definer
as $$ begin return query

insert into budget.categories as inserted (
	name
) values (
	p_name
)
returning
	inserted.id;

end $$;

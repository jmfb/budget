create or replace function budget.categories_s ()
returns table (
	id int,
	name text
)
language plpgsql security definer
as $$ begin return query

select
	categories.id,
	categories.name
from budget.categories as categories
order by
	categories.name asc;

end $$;

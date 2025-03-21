create or replace function budget.category_s (
	p_id int
)
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
where
	categories.id = p_id;

end $$;

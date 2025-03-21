create or replace function budget.transaction_i (
	p_date date,
	p_source_id int,
	p_raw_text text,
	p_amount money,
	p_original_category text,
	p_category_id int,
	p_note text,
	p_expense_id int,
	p_income_id int
)
returns table (
	id int
)
language plpgsql security definer
as $$ begin return query

insert into budget.transactions (
	"date",
	source_id,
	raw_text,
	amount,
	original_category,
	category_id,
	note,
	expense_id,
	income_id
) values (
	p_date,
	p_source_id,
	p_raw_text,
	p_amount,
	p_original_category,
	p_category_id,
	p_note,
	p_expense_id,
	p_income_id
)
returning
	id;

end $$;

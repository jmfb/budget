create or replace function budget.transaction_u (
	p_id int,
	p_date date,
	p_source_id int,
	p_raw_text text,
	p_amount money,
	p_original_category text,
	p_category_id int,
	p_description text,
	p_note text,
	p_expense_id int,
	p_income_id int
)
returns void
language plpgsql security definer
as $$ begin

update budget.transactions as transactions_update
set
	"date" = p_date,
	source_id = p_source_id,
	raw_text = p_raw_text,
	amount = p_amount,
	original_category = p_original_category,
	category_id = p_category_id,
	description = p_description,
	note = p_note,
	expense_id = p_expense_id,
	income_id = p_income_id
where
	transactions_update.id = p_id;

end $$;

create or replace function budget.diagnostics_s ()
returns table (
	start_time timestamp with time zone,
	server_time timestamp with time zone,
	version text
)
language plpgsql security definer
as $$ begin return query

select
	pg_postmaster_start_time() as start_time,
	now() as server_time,
	version() as version;

end $$;

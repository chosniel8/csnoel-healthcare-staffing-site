# CSNoel Integration Standards

## OpenAI Responses API

The chatbot will call `POST /v1/responses` from server-side code only. The request will supply code-managed `instructions`, the approved model, the current user input, and three strict function tools: `search_jobs`, `get_job_details`, and `submit_lead`. When the response contains a `function_call` item, the server will validate the arguments, execute the corresponding Supabase-backed handler, append a `function_call_output` item using the model-provided `call_id`, and continue the same response loop until final text is returned.

The published playground prompt is retained as a reference, but it is not used at runtime because OpenAI’s current prompting guidance recommends code-managed, version-controlled prompts for new work and documents the planned shutdown of reusable prompt objects on November 30, 2026.

## Private Resume Storage

Resumes are stored only in the non-public `resumes` bucket in the CSNoel Supabase project. The application backend will issue short-lived upload URLs after server-side validation, then will retain only the private object path with the application record. Administrative download access will be generated server-side as time-limited signed URLs. No browser receives the Supabase service-role key.

## Sources

- [OpenAI Function Calling](https://developers.openai.com/api/docs/guides/function-calling)
- [OpenAI Responses API Migration Guide](https://developers.openai.com/api/docs/guides/migrate-to-responses)
- [OpenAI Prompting Guidance](https://developers.openai.com/api/docs/guides/prompting)
- [Supabase Storage Buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals)
- [Supabase Signed Upload URLs](https://supabase.com/docs/reference/javascript/storage-from-createsigneduploadurl)

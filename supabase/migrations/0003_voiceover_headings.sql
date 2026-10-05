-- The voice-over page's headings were hardcoded, so Cote could change the body
-- copy but not the words above it. These seed the current wording so the admin
-- fields open pre-filled rather than blank.
insert into public.content_blocks (key, value) values
  ('voiceovers_heading',       'Cote Lind'),
  ('voiceovers_location',      'Chicago, USA'),
  ('voiceovers_cta',           'Book Cote Lind'),
  ('voiceovers_works_heading', 'Past Works')
on conflict (key) do nothing;

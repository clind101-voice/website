-- Seed content_blocks with the real copy carried over from the Wix site.
-- Safe to re-run: upserts by key.

insert into public.content_blocks (key, value) values
  ('home_hero_tagline', 'Half City! Half Country Girl!'),
  ('home_song_title', 'My New Song! Ready For The Love'),
  ('about_bio', E'As a Chicago native with a lively Southern touch, I bring a unique blend of experiences to my creative work. I''m told I have an innate talent for expression and a gift for laughing at myself, and that balance allows me to truly embody the characters I play. My endless curiosity and zest for living are what bring my performances to life, and I take my craft seriously while having a lot of fun along the way.\n\nI''ve been singing my whole life, but my innate capacity to embody the emotions of others is what led me to the performing arts and the nuanced art of expression, both "seen and unseen." This is why I''m so drawn to voice-over work—I love bringing a character to life with just my voice. While I once thought being behind the scenes was enough, my studies at Act One Studios ignited a passion for live theatre. It was there that I learned to take direction and embrace the creative exchange with a director to deliver a vibrant, collaborative performance.\n\nMy experience as a vocalist and songwriter, capturing the real experiences of life, give way to performances with authentic depth that resonates with me and my audiences. With vast life experiences and a rich imagination I enjoy performing diverse genres of music and consider myself an "Interpreter Of Song". I''m energized by new challenges and thrive on bringing a clear vision to life. And to think, there''s so much more to come!'),
  ('singing_intro', 'Youtube is my friend'),
  ('acting_intro', 'Meet Ms. Snowfield of the Urban League "Bronzeville The Musical"'),
  ('voiceovers_intro', 'Voice demo!'),
  ('contact_blurb', 'Join my mailing list or reach out to contact or book me!')
on conflict (key) do update set value = excluded.value, updated_at = now();

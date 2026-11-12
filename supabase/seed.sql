-- Seed inicial para o ambiente local de desenvolvimento.
-- A execução deste script deve ocorrer após as migrações do schema principal.

truncate public.daily_menu_items, public.daily_menus, public.dishes, public.categories, public.admin_settings restart identity cascade;

insert into public.categories (id, name)
values
  ('11111111-1111-1111-1111-111111111111', 'Pratos Executivos'),
  ('22222222-2222-2222-2222-222222222222', 'Massas'),
  ('33333333-3333-3333-3333-333333333333', 'Acompanhamentos'),
  ('44444444-4444-4444-4444-444444444444', 'Bebidas');

insert into public.dishes (
  id,
  category_id,
  name,
  description,
  price,
  photo_url,
  is_active
)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Feijoada da Casa',
    'Feijoada com arroz, farofa, cebola e laranja.',
    32.90,
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    'Frango ao Molho',
    'Frango grelhado com molho caseiro e acompanhamento.',
    28.50,
    'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '22222222-2222-2222-2222-222222222222',
    'Macarrão ao Alho e Óleo',
    'Macarrão com alho, azeite, cheiro-verde e queijo parmesão.',
    24.00,
    'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '22222222-2222-2222-2222-222222222222',
    'Lasanha de Carne',
    'Lasanha com molho de tomate, queijo e carne moída.',
    26.00,
    'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '33333333-3333-3333-3333-333333333333',
    'Salada de Folhas',
    'Mix de folhas verdes com tomate, pepino e molho de ervas.',
    14.00,
    'https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=1200&q=80',
    true
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '44444444-4444-4444-4444-444444444444',
    'Suco Natural de Laranja',
    'Suco natural servido gelado.',
    8.50,
    'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=1200&q=80',
    true
  );

insert into public.daily_menus (id, menu_date, status, published_at)
values
  (
    '10101010-1010-1010-1010-101010101010',
    current_date,
    'PUBLICADO',
    now()
  ),
  (
    '20202020-2020-2020-2020-202020202020',
    current_date + interval '1 day',
    'RASCUNHO',
    null
  );

insert into public.daily_menu_items (id, menu_id, dish_id, available)
values
  ('11111111-aaaa-aaaa-aaaa-111111111111', '10101010-1010-1010-1010-101010101010', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', true),
  ('22222222-bbbb-bbbb-bbbb-222222222222', '10101010-1010-1010-1010-101010101010', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', true),
  ('33333333-cccc-cccc-cccc-333333333333', '10101010-1010-1010-1010-101010101010', 'cccccccc-cccc-cccc-cccc-cccccccccccc', true),
  ('44444444-dddd-dddd-dddd-444444444444', '10101010-1010-1010-1010-101010101010', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', true),
  ('55555555-ffff-ffff-ffff-555555555555', '10101010-1010-1010-1010-101010101010', 'ffffffff-ffff-ffff-ffff-ffffffffffff', true),
  ('66666666-aaaa-bbbb-cccc-666666666666', '20202020-2020-2020-2020-202020202020', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', true),
  ('77777777-bbbb-cccc-dddd-777777777777', '20202020-2020-2020-2020-202020202020', 'dddddddd-dddd-dddd-dddd-dddddddddddd', false),
  ('88888888-cccc-dddd-eeee-888888888888', '20202020-2020-2020-2020-202020202020', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', true),
  ('99999999-dddd-eeee-ffff-999999999999', '20202020-2020-2020-2020-202020202020', 'ffffffff-ffff-ffff-ffff-ffffffffffff', true);

insert into public.admin_settings (
  id,
  owner_name,
  whatsapp,
  timezone,
  opening_time,
  closing_time
)
values (
  '90909090-9090-9090-9090-909090909090',
  'Sabor de Casa',
  '+55 83 99999-1234',
  'America/Sao_Paulo',
  '11:00:00',
  '14:00:00'
);

-- A criação de um usuário admin real deve ocorrer no Supabase Auth.
-- Após isso, insira o id do usuário na tabela public.admin_profiles.
-- Exemplo:
-- insert into public.admin_profiles (id, role)
-- values ('<AUTH_USER_ID>', 'admin');

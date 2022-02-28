import Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :share_view, ShareViewWeb.Endpoint,
  http: [ip: {127, 0, 0, 1}, port: 4002],
  secret_key_base: "XvAhcqNafuBONkMEl6z2Fo6JijZq+8ET1cDZTlAchj5Q7vGLnxfz/jMGj4To79py",
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

# Initialize plugs at runtime for faster test compilation
config :phoenix, :plug_init_mode, :runtime

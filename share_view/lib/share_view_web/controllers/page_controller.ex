defmodule ShareViewWeb.PageController do
  use ShareViewWeb, :controller

  def index(conn, _params) do
    signed = Phoenix.Token.sign(ShareViewWeb.Endpoint, "user socket", ShareViewWeb.Names.generate())
    render(conn, "index.html", user_token: signed)
  end
end

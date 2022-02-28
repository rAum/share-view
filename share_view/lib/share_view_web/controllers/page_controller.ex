defmodule ShareViewWeb.PageController do
  use ShareViewWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end

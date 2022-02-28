defmodule ShareViewWeb.CursorChannel do
  use ShareViewWeb, :channel

  @impl true
  def join("cursor:lobby", payload, socket) do
    if authorized?(payload) do
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  @spec handle_in(<<_::32>>, map, Phoenix.Socket.t()) :: {:noreply, Phoenix.Socket.t()}
  def handle_in("move", %{"x" => x, "y" => y}, socket) do
    name = socket.assigns.current_user
    broadcast(socket, "move", %{"x"=> x, "y" => y, "name" => name})
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end
end

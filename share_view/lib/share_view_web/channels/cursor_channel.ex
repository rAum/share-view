defmodule ShareViewWeb.CursorChannel do
  use ShareViewWeb, :channel
  alias ShareViewWeb.CursorPresence

  @impl true
  def join("cursor:lobby", payload, socket) do
    if authorized?(payload) do
      send(self(), :after_join)
      {:ok, socket}
    else
      {:error, %{reason: "unauthorized"}}
    end
  end

  @impl true
  @spec handle_in(<<_::32>>, map, Phoenix.Socket.t()) :: {:noreply, Phoenix.Socket.t()}
  def handle_in("move", %{"x" => x, "y" => y}, socket) do
    {:ok, _} = CursorPresence.update(socket, socket.assigns.current_user, fn previousState ->
      Map.merge(previousState, %{
        online_at: inspect(System.system_time(:second)),
        x: x,
        y: y,
        color: ShareView.Colors.getHSL(socket.assigns.current_user),
      })
    end )
    {:noreply, socket}
  end

  # Add authorization logic here as required.
  defp authorized?(_payload) do
    true
  end

  @impl true
  @spec handle_info(:after_join, Phoenix.Socket.t()) :: {:noreply, Phoenix.Socket.t()}
  def handle_info(:after_join, socket) do
    {:ok, _} = CursorPresence.track(socket, socket.assigns.current_user, %{
      online_at: inspect(System.system_time(:second)),
      color: ShareView.Colors.getHSL(socket.assigns.current_user),
    })
    push(socket, "presence_state", CursorPresence.list(socket))
    {:noreply, socket}
  end
end

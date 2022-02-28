import {Socket, Presence} from "phoenix"

function cursorTemplate({x, y, name, color}) {
  const li = document.createElement('li');
  console.log(x, y);
  li.style.left = (x-6) + 'px';
  li.style.top = (y-5) + 'px';
  li.style.color = color;
  li.style.borderColor = color;
  li.innerHTML = `
  <svg
  version="1.1"
  width="25px"
  height="25px"
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 21 21">
    <polygon
      fill="black"
      points="8.2,20.9 8.2,4.9 19.8,16.5 13,16.5 12.6,16.6" />
    <polygon
      fill="currentColor"
      points="9.2,7.3 9.2,18.5 12.2,15.6 12.6,15.5 17.4,15.5"
    />
</svg>
<span class="mt-1 ml-4 px-1 text-sm text-pink-300" />
  `;
  li.lastChild.textContent = name;
  return li;
}

// And connect to the path in "lib/share_view_web/endpoint.ex". We pass the
// token for authentication. Read below how it should be used.
let socket = new Socket("/socket", {params: {token: sessionStorage.userToken}})

// When you connect, you'll often need to authenticate the client.
// For example, imagine you have an authentication plug, `MyAuth`,
// which authenticates the session and assigns a `:current_user`.
// If the current user exists you can assign the user's token in
// the connection for use in the layout.
//
// In your "lib/share_view_web/router.ex":
//
//     pipeline :browser do
//       ...
//       plug MyAuth
//       plug :put_user_token
//     end
//
//     defp put_user_token(conn, _) do
//       if current_user = conn.assigns[:current_user] do
//         token = Phoenix.Token.sign(conn, "user socket", current_user.id)
//         assign(conn, :user_token, token)
//       else
//         conn
//       end
//     end
//
// Now you need to pass this token to JavaScript. You can do so
// inside a script tag in "lib/share_view_web/templates/layout/app.html.heex":
//
//     <script>window.userToken = "<%= assigns[:user_token] %>";</script>
//
// You will need to verify the user token in the "connect/3" function
// in "lib/share_view_web/channels/user_socket.ex":
//
//     def connect(%{"token" => token}, socket, _connect_info) do
//       # max_age: 1209600 is equivalent to two weeks in seconds
//       case Phoenix.Token.verify(socket, "user socket", token, max_age: 1_209_600) do
//         {:ok, user_id} ->
//           {:ok, assign(socket, :user, user_id)}
//
//         {:error, reason} ->
//           :error
//       end
//     end
//
// Finally, connect to the socket:
socket.connect()

let channel = socket.channel("cursor:lobby", {})
channel.join()
  .receive("ok", resp => { console.log("Joined successfully", resp) 
    document.addEventListener('mousemove', (e) => {
      const x = e.pageX / window.innerWidth;
      const y = e.pageY / window.innerHeight;
      channel.push('move', {x, y});
    })
  })
  .receive("error", resp => { console.log("Unable to join", resp) })

  // channel.on('move', ({x, y, name}) => {
  //   const ul = document.createElement('ul');
  //   const cursorLi = cursorTemplate({x: x * window.innerWidth, y: y * window.innerHeight, name: name});
  //   ul.appendChild(cursorLi);
  //   document.getElementById('cursor-list').innerHTML = ul.innerHTML;
  // });

const presence = new Presence(channel);
presence.onSync(()=> {
    const ul = document.createElement('ul');

    presence.list((name, {metas: [firstDevice] }) => {
      const {x, y, color} = firstDevice;
      const cursorLi = cursorTemplate({x: x * window.innerWidth, y: y * window.innerHeight, name: name, color: color});
      ul.appendChild(cursorLi);
    });

    document.getElementById('cursor-list').innerHTML = ul.innerHTML;
});

export default socket

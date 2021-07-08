import { useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { database } from '../services/firebase';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';
import logInImg from '../assets/images/log-in.svg';

import { Button } from '../components/Button';

import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';

export function Home(){
  const history = useHistory();
  const { signInWithGoogle, user, signOutWithGoogle } = useAuth();
  const [roomCode, setRoomCode] = useState('');

  async function handleCreateRoom(){
    if(!user){
      await signInWithGoogle();
    }

    history.push('/rooms/new');
    toast.success("Tudo certo, você já pode criar uma sala");
  }

  async function handleJoinRoom(event: FormEvent){
    event.preventDefault();

    if(roomCode.trim() === ''){
      toast.error("Digite o código da sala");

      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();
    if(!roomRef.exists()){
      toast.error("Essa sala não existe");
      return;
    }

    if(roomRef.val().closedAt){
      toast.error("Sala já encerrada");
      return;
    }

    history.push(`/rooms/${roomCode}`);
  }

  async function handleSignOut(){
    await signOutWithGoogle();

    history.push(`/`);
    toast.success("Deslogado com sucesso");
  }

  return(
    <div id="page-auth">
      <aside>
        <img src={illustrationImg} alt='Ilustração simbolizando perguntas e respostas' />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas da sua audiência em tempo-real</p>
      </aside>
      <main>
        <Toaster/>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />

            { user &&
              <div className="login-info">
                Se você não é {user.name}, <button type="button" onClick={handleSignOut}>clique aqui</button>.
              </div>
            }
            <button onClick={handleCreateRoom} className="create-room">
              <img src={googleIconImg} alt="Logo do Google" />
              Crie sua sala com o Google
            </button>

          <div className="separator">ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={event => setRoomCode(event.target.value)}
              value={roomCode}
            />
            <Button type="submit">
              <img src={logInImg} alt="Botão entrar na sala" />
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}

import { useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { database } from '../services/firebase';
import toast, { Toaster } from 'react-hot-toast';

import LogoImg from '../assets/images/logo.svg';


import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

import { useRoom } from '../hooks/useRoom';
import { useAuth } from '../hooks/useAuth';

import '../styles/room.scss'

type RoomParams = {
  id: string;
}

export function UserRooms(){
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const {user, signOutWithGoogle} = useAuth();

  async function handleSignOut(){
    await signOutWithGoogle();

    history.push(`/`);
    toast.success("Deslogado com sucesso");
  }


  return(
    <div id="page-room">
      <header>
        <div className="content">
          <Link to="/"><img src={LogoImg} alt="Letmeask" /></Link>
          <div>
            { user && (
              <>
                <Button>Listar minhas salas</Button>
                <Button isOutlined onClick={handleSignOut}>Deslogar</Button>
              </>
            )}

          </div>
        </div>
      </header>
      <main>
        <Toaster/>
        <div className="room-title">
          <h1>Sala [title]</h1>
        </div>

        <div className="rooms-list">

        </div>

      </main>
    </div>
  );
}

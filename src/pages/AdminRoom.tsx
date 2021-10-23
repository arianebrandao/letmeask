import { useEffect } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { database } from '../services/firebase';
import toast, { Toaster } from 'react-hot-toast';

import LogoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button';
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';

import { useRoom } from '../hooks/useRoom';
import { useAuth } from '../hooks/useAuth';

import '../styles/room.scss';
import 'balloon-css';

type RoomParams = {
  id: string;
}

export function AdminRoom(){
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;
  const {user, signOutWithGoogle} = useAuth();

  const { title, questions, authorId } = useRoom(roomId);

  useEffect(() => {
    if (user === null) {
			history.push("/");
      toast.error("Você precisa estar logado");
		}
    else if (authorId && user?.id !== authorId) {
			history.push("/");
      toast.error("Você não tem permissão para fazer isso");
		}
	}, [history, user, authorId]);

  useEffect(() => {
    const roomRef = database.ref(`rooms/${roomId}`);

    roomRef.get().then(room => {
      if(room.val().closedAt) {
        history.push('/');
        toast.error("Sala já encerrada");
      }
    });

    return () => {
      roomRef.off('value');
    }
  }, [roomId, history]);

  async function handleEndRoom(){
    await database.ref(`rooms/${roomId}`).update({
      closedAt: new Date(),
    });

    history.push('/');
    toast.success("Sala encerrada com sucesso");
  }

  async function handleDeleteQuestion(questionId: string){
    if(window.confirm("Tem certeza que deseja excluir esta pergunta?")){
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();

      toast.success("Pergunta excluída com sucesso");
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true,
    });
  }

  async function handleHighlightQuestion(questionId: string){
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true,
    });
  }

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
            <RoomCode code={roomId} />
            { user && (
              <>
                <Button onClick={() => history.push(`/list-rooms`)}>Listar minhas salas</Button>
                <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                <Button isOutlined onClick={handleSignOut}>Deslogar</Button>
              </>
            )}

          </div>
        </div>
      </header>
      <main>
        <Toaster/>
        <div className="room-title">
          <h1>Sala {title}</h1>
          { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key = {question.id}
                content = {question.content}
                author = {question.author}
                isAnswered = {question.isAnswered}
                isHighlighted = {question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                      aria-label="Marcar pergunta como respondida"
                      data-balloon-pos="up"
                    >
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                      aria-label="Dar destaque à pergunta"
                      data-balloon-pos="up"
                    >
                      <img src={answerImg} alt="" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => handleDeleteQuestion(question.id)}
                  aria-label="Remover pergunta"
                  data-balloon-pos="up"
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            )
          })}
        </div>

      </main>
    </div>
  );
}

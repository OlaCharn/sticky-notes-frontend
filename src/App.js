import React, { useEffect, useState } from "react";
import './App.css';
import { VscAdd, VscEdit } from "react-icons/vsc";
import { getAllNotes, addNote, editNote, deleteNote } from "./FetchNotes";
import { MyNote } from "./MyNote";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

function App() {
  const [myNote, setmyNote] = useState([]);
  const [title, setTitle] = useState("");
  const [editing, setEditing] = useState(false);
  const [noteId, setNoteId] = useState("");

  useEffect(() => {
    getAllNotes(setmyNote);
  }, []);

  const updatingInInput = (_id, title) => {
    setEditing(true);
    setTitle(title);
    setNoteId(_id);
  };

  //DRAG & DROP ОПИСАНИЕ ФУНКЦИИ onDragEnd см ниже
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const reorderedNotes = Array.from(myNote);
    const [movedNote] = reorderedNotes.splice(result.source.index, 1);
    reorderedNotes.splice(result.destination.index, 0, movedNote);
    setmyNote(reorderedNotes);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd} >
      <h1>Drag and Drop Sticky Notes</h1>
            <div className="InputAndButton">
              <input
                type="text"
                placeholder="type your note here (max.30 symbols)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={30} // Ограничение на количество символов
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && title) { // Проверяем, нажата ли клавиша Enter и есть ли текст
                    editing
                      ? editNote(noteId, title, setTitle, setmyNote, setEditing)
                      : addNote(title, setTitle, setmyNote);
                  }
                }}
              />

              <button
                disabled={!title}
                className="SubmitButton"
                onClick={
                  editing
                    ? () => editNote(noteId, title, setTitle, setmyNote, setEditing)
                    : () => addNote(title, setTitle, setmyNote)
                }
              >
                {editing ? <VscEdit /> : <VscAdd />}
              </button>
            </div>

            <Droppable droppableId="droppable" direction="horizontal">
                {(provided) => (
                    <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="App"
                    >

                        {myNote.map((note, index) => (
                        <Draggable key={note._id} draggableId={note._id} index={index}>
                            {(provided, snapshot) => (
                            <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{...provided.draggableProps.style,
                            backgroundColor: snapshot.isDragging ? '#EEEDEB' : '#FFFF88',
                            }}   
                            className="note-container"                
                            >
                                <MyNote
                                text={note.title}
                                updatingInInput={() => updatingInInput(note._id, note.title)}
                                deleteNote={() => deleteNote(note._id, setmyNote)}
                                />
                            </div>
                            )}
                        </Draggable>
                        ))}
                {provided.placeholder}
            </div>
            )}
            </Droppable>

    </DragDropContext>

  );
}

export default App;


//КОММЕНТАРИИ
//<React.StricktMode> </React.StricktMode> REACT 18  vs beautiful-dnd Common problem
// when SrtictMode is on. We have ERROW during dragAndDrop:
// Invariant failed: Cannot find droppable entry with id [droppable]
// https://github.com/atlassian/react-beautiful-dnd/issues/2350 

// react-beautiful-dnd, SNAPSHOT является объектом, предоставляемым компонентами Draggable и Droppable
// во время операций перетаскивания.
//Он содержит информацию о текущем состоянии перетаскивания, такую как то: 
// - находится ли элемент в процессе перетаскивания или над определённым Droppable контейнером.
// Эта информация позволяет вам динамически изменять стиль и поведение этих компонентов 
//в зависимости от их состояния.
//Для Draggable компонентов, snapshot объект может содержать следующие свойства:
//isDragging: true, когда данный элемент перетаскивается.
//draggingOver: идентификатор Droppable контейнера, над которым в данный момент 
//находится перетаскиваемый элемент.

// когда вы используете компонент Draggable, 
//он предоставляет вам два набора свойств через функцию-рендерер: 
//                    {...provided.draggableProps} и {...provided.dragHandleProps}

//{...provided.draggableProps}
//Эти свойства содержат данные и методы, необходимые для того, 
//чтобы библиотека могла управлять перетаскиваемым элементом. Включают в себя информацию о том, 
//как элемент должен быть перемещен и как он взаимодействует с другими Draggable и Droppable элементами.

//{...provided.dragHandleProps}
//Эти свойства определяют, какая часть вашего перетаскиваемого компонента является "ручкой" 
//перетаскивания, то есть той частью, за которую пользователь может захватить и перетащить элемент. 
//Если вы хотите, чтобы весь элемент был перетаскиваемым, вы примените эти свойства к тому же элементу,
// что и provided.draggableProps. 
//Если же вы хотите ограничить перетаскивание только определённой частью элемента (например, иконкой или заголовком),
// вы примените dragHandleProps к соответствующему внутреннему элементу.


//ОПИСАНИЕ ФУНКЦИИ
  //Функция onDragEnd вызыввется, когда перетаскивание заверщается.

  // result - аргумент и объект, который несет информацию о событии переставкивания -
  //начальное и конечное положение перетаскиваемого элемента
  //если     if (!result.destination) {
  //и это значит, что destination отсутствует (null || undefined)
  //и значит элемент возвращен обратно на начальную позицию или отпущен вне зоны перетаскивания
  //return - функция прекращает свое исполнение
  //const reorderedNotes = Array.from(myNote); --- создается новый массив как копия массива myNote

  // const [movedNote] = reorderedNotes.splice(result.source.index, 1);: 
  //Мы используем метод splice для удаления элемента из массива на позиции result.source.index. 
  //Этот элемент (заметка, которую мы перемещаем) сохраняется в переменной movedNote 
  //с использованием деструктуризации массива.
  // Таким образом, мы извлекаем перемещенный элемент из начальной позиции.

  //reorderedNotes.splice(result.destination.index, 0, movedNote);:
  //Мы вставляем movedNote обратно в массив на новую позицию result.destination.index. 
  //Таким образом, массив переупорядочивается, и элемент, который мы переместили, 
  //теперь находится в новом положении.

  //setmyNote(reorderedNotes);: 
  //Мы используем функцию установки состояния (setmyNote) для обновления состояния компонента myNote 
  //новым отсортированным массивом reorderedNotes. 
  //Это приводит к перерисовке компонента с новым порядком заметок.


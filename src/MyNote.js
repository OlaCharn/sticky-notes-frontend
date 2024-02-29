import { VscEdit, VscTrash } from "react-icons/vsc";
import React from 'react';

export const MyNote = ({ text, updatingInInput, deleteNote }) => {
  
  return (
    <div className="Note">
      <div className="NoteContent" >
        <p>{text}</p>
      </div>
      <div className="EditAndTrash">
        <VscEdit onClick={updatingInInput} className="NoteIcon" />
        <VscTrash onClick={deleteNote} className="NoteIcon" />
      </div>
    </div>
  );
};

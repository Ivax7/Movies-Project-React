import { useState, useEffect } from "react";
// Importamos botones de la dependencia npm install @tabler/icons-react
import { IconThumbUp } from '@tabler/icons-react';
import { IconBookmark } from '@tabler/icons-react';

export function useMostPopular() {



  return (
    <div className="right-section">
      <article className='popular-animes'>
        <h4>Most Popular</h4>
        <div className="popular-information" style={{ backgroundImage: `url("https://imgs.search.brave.com/zmAyck0jHME1euxh984hHQVYJXKNM1dOK2hf4pi-5IA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aG9iYnljb25zb2xh/cy5jb20vc2l0ZXMv/bmF2aS5heGVsc3By/aW5nZXIuZXMvcHVi/bGljL21lZGlhL2lt/YWdlLzIwMjQvMDgv/b25lLXBpZWNlLTM5/MjY5NTQuanBnP3Rm/PTM4NDB4")` }}>
          <div className="rank first">1</div>
          <div className="title">One Piece</div>
        <div className="action-buttons">
          <button className="save-button"><IconBookmark stroke={2} /></button>
          <button className="like-button"><IconThumbUp stroke={2} /></button>
        </div>

        </div>
        
        <div className="popular-information" style={{ backgroundImage: `url("https://imgs.search.brave.com/zmAyck0jHME1euxh984hHQVYJXKNM1dOK2hf4pi-5IA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9jZG4u/aG9iYnljb25zb2xh/cy5jb20vc2l0ZXMv/bmF2aS5heGVsc3By/aW5nZXIuZXMvcHVi/bGljL21lZGlhL2lt/YWdlLzIwMjQvMDgv/b25lLXBpZWNlLTM5/MjY5NTQuanBnP3Rm/PTM4NDB4")` }}>
          <div className="rank first">1</div>
          <div className="title">One Piece</div>
          <div className="action-buttons">
        
        <button className="save-button"><IconBookmark stroke={2} /></button>
        <button className="like-button"><IconThumbUp stroke={2} /></button>

          </div>
        </div>
      </article>
    </div>
  )
}
// components/CustomCursor.js
import { useEffect, useRef } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Set posisi awal di tengah layar tapi tersembunyi
    cursor.style.opacity = '0';

    const moveCursor = (e) => {
      // Tampilkan kursor saat mouse pertama kali bergerak
      if (cursor.style.opacity === '0') {
        cursor.style.opacity = '1';
      }
      
      // Gunakan transform untuk pergerakan yang lebih mulus
      // clientX dan clientY adalah posisi mouse
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    };

    window.addEventListener('mousemove', moveCursor);

    // Cleanup function untuk menghapus event listener
    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  }, []);

  return (
    // Wadah utama yang akan digerakkan dan dirotasi
    <div ref={cursorRef} className="custom-cursor">
      <div className="cursor-inner">
        <div className="cursor-dot"></div>
        <div className="cursor-chevron cursor-chevron-up"></div>
        <div className="cursor-chevron cursor-chevron-right"></div>
        <div className="cursor-chevron cursor-chevron-down"></div>
        <div className="cursor-chevron cursor-chevron-left"></div>
      </div>
    </div>
  );
};

export default CustomCursor;

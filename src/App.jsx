import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import html2pdf from 'html2pdf.js';
import { ChefHat, FileDown, Sparkles, Utensils, AlertCircle, Info } from 'lucide-react';

export default function App() {
  const [peticion, setPeticion] = useState('');
  const [menu, setMenu] = useState(null);
  const [cargando, setCargando] = useState(false);

  const generarMenu = async () => {
    if (!peticion) return alert('Por favor, describe el menú que deseas...');
    setCargando(true);
    try {
      // 👇 REEMPLAZA ESTA URL CON TU URL REAL DE RENDER 👇
      const response = await fetch('https://menugenius-backend.onrender.com/api/generar-menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peticion })
      });
      const data = await response.json();
      setMenu(data);
    } catch (error) { 
      alert('Error de conexión. Asegúrate de que tu servidor en Render esté "Live".'); 
    }
    setCargando(false);
  };

  const descargarPDF = () => {
    const elemento = document.getElementById('menu-imprimible');
    const opciones = {
      margin: 10,
      filename: `MenuGenius_${menu?.titulo_menu || 'Carta'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opciones).from(elemento).save();
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
      color: '#f8fafc',
      padding: '4rem 1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      
      {/* CABECERA ESTILO AGENCIA */}
      <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ 
          display: 'inline-flex', 
          padding: '1rem', 
          background: 'rgba(255,255,255,0.03)', 
          borderRadius: '24px', 
          marginBottom: '1.5rem', 
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px 0 rgba(0,0,0,0.3)'
        }}>
          <ChefHat size={48} color="#fbbf24" />
        </div>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: '900', 
          letterSpacing: '-3px', 
          margin: 0, 
          background: 'linear-gradient(to bottom, #fff, #94a3b8)', 
          WebkitBackgroundClip: 'text', 
          WebkitTextFillColor: 'transparent' 
        }}>
          MenuGenius <span style={{ color: '#fbbf24', WebkitTextFillColor: '#fbbf24' }}>AI</span>
        </h1>
        <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginTop: '1rem', fontWeight: '300' }}>
          La inteligencia artificial al servicio de la gastronomía.
        </p>
      </div>

      {/* PANEL DE ENTRADA GLASSMORPHISM */}
      <div style={{ 
        maxWidth: '700px', 
        margin: '0 auto', 
        background: 'rgba(30, 41, 59, 0.5)', 
        backdropFilter: 'blur(16px)',
        padding: '2.5rem', 
        borderRadius: '32px', 
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
      }}>
        <textarea 
          style={{ 
            width: '100%', padding: '1.5rem', background: 'rgba(15, 23, 42, 0.3)', 
            color: '#fff', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', 
            fontSize: '1.1rem', outline: 'none', resize: 'none', marginBottom: '1.5rem',
            boxSizing: 'border-box', transition: 'all 0.3s',
            fontFamily: 'inherit'
          }} 
          rows="3"
          placeholder='Ej: "Menú degustación mediterráneo con toque asiático, 6 platos..."'
          value={peticion}
          onChange={e => setPeticion(e.target.value)}
        />
        
        <button 
          onClick={generarMenu} 
          disabled={cargando}
          style={{ 
            width: '100%', padding: '1.2rem', 
            background: cargando ? '#334155' : 'linear-gradient(to right, #fbbf24, #f59e0b)', 
            color: '#000', borderRadius: '18px', border: 'none', fontWeight: '800', 
            fontSize: '1.1rem', cursor: cargando ? 'not-allowed' : 'pointer', 
            display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px',
            boxShadow: '0 10px 15px -3px rgba(251, 191, 36, 0.3)',
            transition: 'transform 0.2s'
          }}
        >
          {cargando ? <Sparkles className="animate-pulse" size={20} /> : <Utensils size={20} />}
          {cargando ? 'ELABORANDO CARTA...' : 'GENERAR MI MENÚ PROFESIONAL'}
        </button>
      </div>

      {/* RESULTADO Y EXPORTACIÓN */}
      {menu && (
        <div style={{ maxWidth: '850px', margin: '5rem auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
            <button 
              onClick={descargarPDF} 
              style={{ 
                padding: '1rem 2.5rem', background: '#10b981', color: 'white', 
                borderRadius: '16px', border: 'none', cursor: 'pointer', 
                fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)'
              }}
            >
              <FileDown size={22} /> GUARDAR CARTA EN PDF
            </button>
          </div>

          {/* CARTA IMPRIMIBLE ESTILO RESTAURANTE MICHELIN */}
          <div id="menu-imprimible" style={{ 
            background: '#fff', color: '#1a1a1a', padding: '6rem 4rem', 
            boxShadow: '0 0 60px rgba(0,0,0,0.5)', borderRadius: '2px',
            minHeight: '1000px', position: 'relative'
          }}>
            {/* Cabecera Carta */}
            <div style={{ textAlign: 'center', borderBottom: '1px solid #1a1a1a', paddingBottom: '3rem', marginBottom: '4rem' }}>
              <p style={{ letterSpacing: '5px', fontSize: '0.9rem', marginBottom: '1rem', color: '#666' }}>CARTA DE TEMPORADA</p>
              <h2 style={{ fontSize: '4rem', margin: '0 0 1rem 0', fontFamily: 'serif', fontWeight: '400' }}>
                {menu.titulo_menu}
              </h2>
              <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: '#444', maxWidth: '80%', margin: '0 auto' }}>
                {menu.descripcion_breve}
              </p>
              <div style={{ marginTop: '2.5rem', opacity: '0.8' }}>
                <QRCodeCanvas value={`https://menu.genius/${menu.titulo_menu.substring(0,5)}`} size={70} />
              </div>
            </div>

            {/* Categorías y Platos */}
            {menu.categorias?.map((cat, i) => (
              <div key={i} style={{ marginBottom: '4rem' }}>
                <h3 style={{ 
                  textAlign: 'center', fontSize: '1.6rem', letterSpacing: '4px', 
                  textTransform: 'uppercase', marginBottom: '2.5rem', color: '#111' 
                }}>
                  — {cat.nombre_categoria} —
                </h3>
                {cat.platos?.map((p, j) => (
                  <div key={j} style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                    <h4 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', fontFamily: 'serif' }}>{p.nombre}</h4>
                    <p style={{ margin: '0 auto', maxWidth: '75%', color: '#4b5563', lineHeight: '1.7', fontSize: '1.1rem' }}>
                      {p.descripcion}
                    </p>
                    {p.alergenos && p.alergenos.length > 0 && (
                      <p style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.6rem', letterSpacing: '1px' }}>
                         {p.alergenos.join(' · ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ))}

            {/* Pie de Carta */}
            <div style={{ position: 'absolute', bottom: '4rem', left: 0, right: 0, textAlign: 'center' }}>
                <p style={{ fontSize: '0.8rem', color: '#ccc', letterSpacing: '2px' }}>MENUGENIUS AI · 2026</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

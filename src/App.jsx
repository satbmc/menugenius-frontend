import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import html2pdf from 'html2pdf.js';
import { ChefHat, FileDown, Sparkles, Utensils, AlertCircle } from 'lucide-react';

export default function App() {
  const [peticion, setPeticion] = useState('');
  const [menu, setMenu] = useState(null);
  const [cargando, setCargando] = useState(false);

  const generarMenu = async () => {
    if (!peticion) return alert('Por favor, dime qué menú necesitas.');
    setCargando(true);
    try {
      
      // 👇 ¡AQUÍ ES DONDE SUCEDE LA MAGIA! 👇
      // Cambia la URL de abajo por la que te dio Render (asegúrate de mantener las comillas y el /api/generar-menu al final)
      
      const response = await fetch('https://menugenius-backend.onrender.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ peticion })
      });
      
      // 👆 HASTA AQUÍ 👆

      const data = await response.json();
      setMenu(data);
    } catch (error) { 
      alert('Error de conexión con la cocina (servidor). Revisa que Render esté encendido.'); 
    }
    setCargando(false);
  };

  const descargarPDF = () => {
    const elemento = document.getElementById('menu-imprimible');
    const opciones = {
      margin:       10,
      filename:     `${menu.titulo_menu.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opciones).from(elemento).save();
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', padding: '2rem 1rem', fontFamily: 'system-ui, sans-serif' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
          <ChefHat size={40} color="#000" />
          <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: '800', letterSpacing: '-1px' }}>MenuGenius</h1>
        </div>
        
        <p style={{ color: '#4b5563', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
          Describe tu menú ideal. Nuestra Inteligencia Artificial lo diseñará, calculará y maquetará por ti.
        </p>
        
        <textarea 
          style={{ width: '100%', padding: '1.2rem', borderRadius: '12px', border: '2px solid #e5e7eb', marginBottom: '1.5rem', minHeight: '120px', fontSize: '1rem', outline: 'none', boxSizing: 'border-box' }} 
          placeholder='Ej: "Un menú de San Valentín a 40€ con opciones de marisco..."' 
          value={peticion} 
          onChange={e => setPeticion(e.target.value)} 
        />
        
        <button 
          onClick={generarMenu} 
          disabled={cargando} 
          style={{ width: '100%', padding: '1.2rem', backgroundColor: cargando ? '#9ca3af' : '#000', color: 'white', borderRadius: '12px', cursor: cargando ? 'not-allowed' : 'pointer', fontSize: '1.1rem', fontWeight: 'bold', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', border: 'none' }}
        >
          {cargando ? <Sparkles className="animate-pulse" /> : <Utensils />}
          {cargando ? 'La IA está cocinando...' : 'Generar Menú Mágico'}
        </button>
      </div>

      {menu && (
        <div style={{ maxWidth: '800px', margin: '3rem auto 0' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button 
              onClick={descargarPDF}
              style={{ padding: '0.8rem 1.5rem', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', border: 'none', fontWeight: 'bold' }}
            >
              <FileDown size={20} />
              Descargar en PDF (Listo para imprimir)
            </button>
          </div>

          <div id="menu-imprimible" style={{ backgroundColor: '#fff', padding: '4rem', borderRadius: '8px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #000', paddingBottom: '2rem', marginBottom: '3rem' }}>
              <div style={{ maxWidth: '70%' }}>
                <h2 style={{ fontSize: '3rem', margin: '0 0 1rem 0', fontFamily: 'Georgia, serif', lineHeight: '1.1' }}>{menu.titulo_menu}</h2>
                <p style={{ fontSize: '1.2rem', color: '#4b5563', fontStyle: 'italic', margin: 0 }}>{menu.descripcion_breve}</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <QRCodeCanvas value={`https://menu-genius.com/m/${menu.titulo_menu.replace(/\s+/g, '')}`} size={100} level="H" />
              </div>
            </div>

            <div>
              {menu.categorias?.map((cat, i) => (
                <div key={i} style={{ marginBottom: '3rem' }}>
                  <h3 style={{ fontSize: '1.5rem', textTransform: 'uppercase', letterSpacing: '2px', color: '#111827', borderBottom: '1px dotted #ccc', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>{cat.nombre_categoria}</h3>
                  <div style={{ display: 'grid', gap: '2rem' }}>
                    {cat.platos?.map((plato, j) => (
                      <div key={j}>
                        <h4 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', fontFamily: 'Georgia, serif', color: '#1f2937' }}>{plato.nombre}</h4>
                        <p style={{ margin: 0, color: '#4b5563', lineHeight: '1.6' }}>{plato.descripcion}</p>
                        {plato.alergenos && plato.alergenos.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.8rem' }}>
                            {plato.alergenos.map((alergeno, idx) => (
                              <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#fef2f2', color: '#991b1b', padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600', border: '1px solid #fee2e2' }}>
                                <AlertCircle size={12} /> {alergeno}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

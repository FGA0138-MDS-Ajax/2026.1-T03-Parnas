// PainelRelatorios.tsx — Painel Analítico com Métricas e Gráficos
'use client';

import React, { useEffect, useState } from 'react';
import { Ticket, Technician } from '../types';
import { gerenteService } from '../services/gerenteService';

export default function PainelRelatorios() {
  const [chamados, setChamados] = useState<Ticket[]>([]);
  const [tecnicos, setTecnicos] = useState<Technician[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [chamadosData, tecnicosData] = await Promise.all([
          gerenteService.getTodosChamados(),
          gerenteService.getTecnicosDisponiveis(),
        ]);
        setChamados(chamadosData);
        setTecnicos(tecnicosData);
      } catch (e) {
        console.error('Erro ao carregar dados de relatórios', e);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 1. Cálculos de Estatísticas de Status
  const total = chamados.length;
  const concluidos = chamados.filter(c => c.status === 'CONCLUIDO').length;
  const emCurso = chamados.filter(c => c.status === 'EM_ANDAMENTO' || c.status === 'ATRIBUIDO').length;
  const abertos = chamados.filter(c => c.status === 'ABERTO').length;
  
  const taxaResolucaoExata = total > 0 ? (concluidos / total) * 100 : 0;
  const taxaResolucao = Math.round(taxaResolucaoExata);

  // 2. Cálculos de Categoria (Hidráulica, Elétrica, Refrigeração, Outros)
  const getVolumetriaCategoria = (cat: string) => {
    return chamados.filter(c => c.tipo_manutencao.toLowerCase().includes(cat.toLowerCase())).length;
  };

  const catHidraulica = getVolumetriaCategoria('hidráulica');
  const catEletrica = getVolumetriaCategoria('elétrica') + getVolumetriaCategoria('iluminação');
  const catRefrigeracao = getVolumetriaCategoria('refrigeração');
  const catInfraestrutura = getVolumetriaCategoria('infraestrutura');
  const catEquipamentos = getVolumetriaCategoria('equipamento');
  
  const catOutros = total - (catHidraulica + catEletrica + catRefrigeracao + catInfraestrutura + catEquipamentos);

  const maxCatVal = Math.max(catHidraulica, catEletrica, catRefrigeracao, catInfraestrutura, catEquipamentos, catOutros, 1);
  const getWidthPercent = (val: number) => {
    return `${(val / maxCatVal) * 100}%`;
  };

  // 3. SVG Donut das métricas (stroke-dasharray e dashoffset)
  // Perímetro do círculo com r=15.91549430918954 é exatamente 100.
  // Isso facilita definir dasharray como "porcentagem restante"
  const strokeDashArray = `${taxaResolucaoExata} ${100 - taxaResolucaoExata}`;
  const strokeDashOffset = 25; // Começa no topo (-90deg)

  const handleExportPDF = async () => {
    setExporting(true);
    
    try {
      const jsPDF = (await import('jspdf')).default;
      const doc = new jsPDF();
      
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // Header Background
      doc.setFillColor(7, 26, 62); // #071A3E
      doc.rect(0, 0, pageWidth, 25, 'F');
      
      // Header Logo
      const logoImg = new Image();
      logoImg.src = '/keep-unb-ln.png';
      await new Promise((resolve) => {
        logoImg.onload = resolve;
        logoImg.onerror = resolve;
      });
      
      if (logoImg.width) {
        const targetHeight = 15;
        const targetWidth = (targetHeight * logoImg.width) / logoImg.height;
        doc.addImage(logoImg, 'PNG', 15, 5, targetWidth, targetHeight);
      }
      
      // Date
      const dateStr = new Date().toLocaleDateString('pt-BR');
      doc.setTextColor(255, 255, 255);
      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.text(`Data: ${dateStr}`, pageWidth - 15, 15, { align: 'right' });
      
      let yPos = 40;
      
      // Helper function for Section Titles
      const drawSectionTitle = (title: string, y: number) => {
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(14);
        doc.setFont('times', 'bold');
        doc.text(title, 15, y);
        
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.5);
        doc.line(15, y + 2, pageWidth - 15, y + 2);
        return y + 10;
      };
      
      yPos = drawSectionTitle('Resumo Executivo', yPos);
      
      // Description Paragraph
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont('times', 'normal');
      
      const today = new Date();
      const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
      const dateText = `${today.getDate()} de ${meses[today.getMonth()]} de ${today.getFullYear()}`;
      
      const p1 = `Este relatório apresenta os principais indicadores de manutenção, o volume de chamados registrados e o desempenho dos técnicos responsáveis no período referente a ${dateText}.`;
      
      const splitDesc = doc.splitTextToSize(p1, pageWidth - 30);
      doc.text(splitDesc, 15, yPos);
      yPos += (splitDesc.length * 5) + 10;
      
      // Indicadores Operacionais
      yPos = drawSectionTitle('Indicadores Operacionais', yPos);
      
      // Draw Boxes for indicators
      const boxWidth = (pageWidth - 30) / 4;
      doc.setFillColor(245, 245, 245);
      doc.rect(15, yPos, pageWidth - 30, 25, 'F');
      
      doc.setDrawColor(220, 220, 220);
      doc.rect(15, yPos, pageWidth - 30, 25, 'S');
      
      // Vertical lines
      for(let i=1; i<4; i++) {
        doc.line(15 + (boxWidth * i), yPos, 15 + (boxWidth * i), yPos + 25);
      }
      
      // Horizontal line
      doc.line(15, yPos + 15, pageWidth - 15, yPos + 15);
      
      const indLabels = ['Total de Chamados', 'Concluídos', 'Em Curso', 'Abertos'];
      const indValues = [total, concluidos, emCurso, abertos];
      
      for(let i=0; i<4; i++) {
        // Value
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(22);
        doc.setFont('times', 'bold');
        doc.text(indValues[i].toString(), 15 + (boxWidth * i) + (boxWidth/2), yPos + 10, { align: 'center' });
        
        // Label
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.setFont('times', 'normal');
        doc.text(indLabels[i], 15 + (boxWidth * i) + (boxWidth/2), yPos + 21, { align: 'center' });
      }
      
      yPos += 40;
      
      // Taxa de Resolução
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.setFont('times', 'bold');
      doc.text('Taxa de Resolução', 15, yPos);
      
      doc.setTextColor(42, 163, 78);
      doc.setFontSize(14);
      doc.text(`${taxaResolucao}%`, pageWidth - 15, yPos, { align: 'right' });
      
      yPos += 5;
      
      // Progress Bar
      doc.setFillColor(220, 220, 225); // Gray background
      doc.rect(15, yPos, pageWidth - 30, 5, 'F');
      
      if (taxaResolucao > 0) {
        doc.setFillColor(42, 163, 78); // Green bar
        const barWidth = ((pageWidth - 30) * taxaResolucao) / 100;
        doc.rect(15, yPos, barWidth, 5, 'F');
      }
      
      yPos += 20;
      
      // Distribuição por Categoria
      yPos = drawSectionTitle('Distribuição por Categoria', yPos);
      
      // Table Header
      doc.setFillColor(7, 26, 62);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('times', 'bold');
      doc.text('Categoria', 20, yPos + 5.5);
      doc.text('Qtd.', pageWidth/2, yPos + 5.5, { align: 'center' });
      doc.text('Participação', pageWidth - 20, yPos + 5.5, { align: 'right' });
      
      yPos += 8;
      
      const categorias = [
        { nome: 'Hidráulica', qt: catHidraulica },
        { nome: 'Elétrica / Iluminação', qt: catEletrica },
        { nome: 'Refrigeração', qt: catRefrigeracao },
        { nome: 'Infraestrutura', qt: catInfraestrutura },
        { nome: 'Equipamentos', qt: catEquipamentos },
        { nome: 'Outros', qt: catOutros }
      ];
      
      categorias.forEach((cat, idx) => {
        if (idx % 2 === 0) {
          doc.setFillColor(245, 248, 252);
          doc.rect(15, yPos, pageWidth - 30, 8, 'F');
        }
        
        doc.setTextColor(0, 0, 0);
        doc.setFont('times', 'normal');
        doc.text(cat.nome, 20, yPos + 5.5);
        
        doc.setTextColor(0, 0, 0);
        doc.setFont('times', 'bold');
        doc.text(cat.qt.toString(), pageWidth/2, yPos + 5.5, { align: 'center' });
        
        doc.setTextColor(0, 0, 0);
        doc.setFont('times', 'normal');
        const part = total > 0 ? Math.round((cat.qt / total) * 100) + '%' : '—';
        doc.text(part, pageWidth - 20, yPos + 5.5, { align: 'right' });
        
        yPos += 8;
      });
      
      doc.setDrawColor(220, 220, 220);
      doc.line(15, yPos, pageWidth - 15, yPos);
      
      yPos += 15;
      
      // Desempenho dos Técnicos
      yPos = drawSectionTitle('Desempenho dos Técnicos', yPos);
      
      // Table Header
      doc.setFillColor(7, 26, 62);
      doc.rect(15, yPos, pageWidth - 30, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('times', 'bold');
      doc.text('Técnico', 20, yPos + 5.5);
      doc.text('Matrícula', 90, yPos + 5.5);
      doc.text('Eficiência', 140, yPos + 5.5, { align: 'center' });
      doc.text('Status', pageWidth - 20, yPos + 5.5, { align: 'right' });
      
      yPos += 8;
      
      tecnicos.forEach((tec, idx) => {
        if (yPos > pageHeight - 30) {
          // Fallback if content exceeds page height
          // Need to store current number of pages for footer logic
          doc.addPage();
          yPos = 20;
          
          doc.setFillColor(7, 26, 62);
          doc.rect(15, yPos, pageWidth - 30, 8, 'F');
          doc.setTextColor(255, 255, 255);
          doc.setFontSize(10);
          doc.setFont('times', 'bold');
          doc.text('Técnico', 20, yPos + 5.5);
          doc.text('Matrícula', 90, yPos + 5.5);
          doc.text('Eficiência', 140, yPos + 5.5, { align: 'center' });
          doc.text('Status', pageWidth - 20, yPos + 5.5, { align: 'right' });
          yPos += 8;
        }
        
        if (idx % 2 === 0) {
          doc.setFillColor(245, 248, 252);
          doc.rect(15, yPos, pageWidth - 30, 8, 'F');
        }
        
        const tecTickets = chamados.filter(c => c.tecnico_id === tec.matricula);
        const tecConcluidos = tecTickets.filter(c => c.status === 'CONCLUIDO').length;
        const totalTec = tecTickets.length;
        const eficiencia = totalTec > 0 ? Math.round((tecConcluidos / totalTec) * 100) : 100;
        
        doc.setTextColor(0, 0, 0);
        doc.setFont('times', 'bold');
        doc.text(tec.nome, 20, yPos + 5.5);
        
        doc.setFont('times', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(tec.matricula, 90, yPos + 5.5);
        
        const isOptimo = eficiencia >= 70;
        doc.setTextColor(isOptimo ? 42 : 220, isOptimo ? 163 : 53, isOptimo ? 78 : 69);
        doc.setFont('times', 'bold');
        doc.text(`${eficiencia}%`, 140, yPos + 5.5, { align: 'center' });
        
        const statusText = totalTec === 0 ? 'Sem dados' : (isOptimo ? 'Ótimo' : 'Baixo');
        doc.text(statusText, pageWidth - 20, yPos + 5.5, { align: 'right' });
        
        yPos += 8;
      });
      
      doc.setDrawColor(220, 220, 220);
      doc.line(15, yPos, pageWidth - 15, yPos);
      
      // Footer
      // @ts-ignore - internal properties can be accessed for custom layouts
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        doc.setFillColor(240, 245, 250);
        doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(8);
        doc.setFont('times', 'normal');
        doc.text('KeepUnB — Relatório Mensal de Manutenção | Gerado automaticamente', 15, pageHeight - 6.5);
        doc.text(`Página ${i}`, pageWidth - 15, pageHeight - 6.5, { align: 'right' });
      }
      
      doc.save('relatorio-manutencao.pdf');
      alert('Relatório salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar relatório: Não foi possível criar o PDF.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      {/* HEADER */}
      <header className="content-header">
        <div>
          <h1 className="content-title">Relatórios e Análise</h1>
          <p className="content-subtitle">Visualize indicadores de desempenho operacional e eficiência de manutenção do campus.</p>
        </div>
        <button 
          className="btn-report-download" 
          onClick={handleExportPDF}
          disabled={loading || exporting}
        >
          {exporting ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1.5s linear infinite' }}>
              <line x1="12" y1="2" x2="12" y2="6"></line>
              <line x1="12" y1="18" x2="12" y2="22"></line>
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
              <line x1="2" y1="12" x2="6" y2="12"></line>
              <line x1="18" y1="12" x2="22" y2="12"></line>
              <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
              <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="-11.5 -10.23 23 20.46" fill="none">
              <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
              <g stroke="currentColor" strokeWidth="1">
                <ellipse rx="11" ry="4.2"/>
                <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
                <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
              </g>
            </svg>
          )}
          <span>{exporting ? 'Compilando...' : 'Exportar Relatório PDF'}</span>
        </button>
      </header>

      {loading ? (
        <div className="table-empty-state">
          <div className="empty-icon" style={{ animation: 'spin 1.5s linear infinite' }}>⏳</div>
          <p>Processando métricas e carregando relatórios...</p>
        </div>
      ) : (
        <>
          {/* GRÁFICOS PRINCIPAIS */}
          <section className="relatorios-grid">
            
            {/* GRÁFICO DE BARRAS DE CATEGORIAS */}
            <div className="chart-card">
              <h3 className="chart-title">Volumetria de Chamados por Categoria</h3>
              
              <div className="bar-chart-container">
                <div className="bar-chart-row">
                  <span className="bar-label">Hidráulica</span>
                  <div className="bar-track">
                    <div className="bar-fill hydraulic" style={{ width: getWidthPercent(catHidraulica) }}></div>
                  </div>
                  <span className="bar-value">{catHidraulica}</span>
                </div>

                <div className="bar-chart-row">
                  <span className="bar-label">Elétrica / Iluminação</span>
                  <div className="bar-track">
                    <div className="bar-fill electric" style={{ width: getWidthPercent(catEletrica) }}></div>
                  </div>
                  <span className="bar-value">{catEletrica}</span>
                </div>

                <div className="bar-chart-row">
                  <span className="bar-label">Refrigeração</span>
                  <div className="bar-track">
                    <div className="bar-fill refrigeration" style={{ width: getWidthPercent(catRefrigeracao) }}></div>
                  </div>
                  <span className="bar-value">{catRefrigeracao}</span>
                </div>

                <div className="bar-chart-row">
                  <span className="bar-label">Infraestrutura</span>
                  <div className="bar-track">
                    <div className="bar-fill infrastructure" style={{ width: getWidthPercent(catInfraestrutura), backgroundColor: '#10B981' }}></div>
                  </div>
                  <span className="bar-value">{catInfraestrutura}</span>
                </div>

                <div className="bar-chart-row">
                  <span className="bar-label">Equipamentos</span>
                  <div className="bar-track">
                    <div className="bar-fill equipment" style={{ width: getWidthPercent(catEquipamentos), backgroundColor: '#6366F1' }}></div>
                  </div>
                  <span className="bar-value">{catEquipamentos}</span>
                </div>

                <div className="bar-chart-row">
                  <span className="bar-label">Outros Serviços</span>
                  <div className="bar-track">
                    <div className="bar-fill other" style={{ width: getWidthPercent(catOutros) }}></div>
                  </div>
                  <span className="bar-value">{catOutros}</span>
                </div>
              </div>
            </div>

            {/* GRÁFICO CIRCULAR DE RESOLUÇÃO */}
            <div className="chart-card">
              <h3 className="chart-title">Taxa de Resolução</h3>
              
              <div className="circle-chart-container">
                <svg viewBox="0 0 36 36" className="svg-donut">
                  <circle className="donut-ring" cx="18" cy="18" r="15.91549430918954" />
                  <circle 
                    className="donut-segment" 
                    cx="18" 
                    cy="18" 
                    r="15.91549430918954" 
                    strokeDasharray={strokeDashArray}
                    strokeDashoffset={strokeDashOffset}
                    style={{ opacity: taxaResolucaoExata === 0 ? 0 : 1 }}
                  />
                  <text x="18" y="15.5" className="donut-center-text">{taxaResolucao}%</text>
                  <text x="18" y="23" className="donut-center-label">Resolvidos</text>
                </svg>

                <div className="donut-legend">
                  <div className="legend-item">
                    <div className="legend-left">
                      <span className="legend-color-dot" style={{ background: 'var(--green-light)' }}></span>
                      <span>Concluídos com Sucesso</span>
                    </div>
                    <span className="legend-right">{concluidos}</span>
                  </div>

                  <div className="legend-item">
                    <div className="legend-left">
                      <span className="legend-color-dot" style={{ background: '#A855F7' }}></span>
                      <span>Em Andamento / Triados</span>
                    </div>
                    <span className="legend-right">{emCurso}</span>
                  </div>

                  <div className="legend-item">
                    <div className="legend-left">
                      <span className="legend-color-dot" style={{ background: '#3B82F6' }}></span>
                      <span>Novos em Aberto</span>
                    </div>
                    <span className="legend-right">{abertos}</span>
                  </div>
                </div>
              </div>
            </div>

          </section>

          {/* RENDIMENTO DA EQUIPE TÉCNICA */}
          <section className="section-panel" style={{ marginTop: '2rem' }}>
            <h2 className="panel-title" style={{ marginBottom: '1.5rem' }}>Desempenho e Histórico por Técnico</h2>
            
            <div className="premium-table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Nome do Técnico</th>
                    <th>Matrícula</th>
                    <th style={{ textAlign: 'center' }}>Atribuídos (Ativos)</th>
                    <th style={{ textAlign: 'center' }}>Concluídos</th>
                    <th style={{ textAlign: 'center' }}>Total Atendidos</th>
                    <th style={{ textAlign: 'center' }}>Eficiência</th>
                  </tr>
                </thead>
                <tbody>
                  {tecnicos.map((tec) => {
                    const tecTickets = chamados.filter(c => c.tecnico_id === tec.matricula);
                    const tecConcluidos = tecTickets.filter(c => c.status === 'CONCLUIDO').length;
                    const tecAtivos = tecTickets.filter(c => c.status === 'EM_ANDAMENTO' || c.status === 'ATRIBUIDO').length;
                    const totalTec = tecTickets.length;
                    const eficiencia = totalTec > 0 ? Math.round((tecConcluidos / totalTec) * 100) : 100;

                    return (
                      <tr key={tec.matricula}>
                        <td className="ticket-cell-local">{tec.nome}</td>
                        <td>{tec.matricula}</td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#C084FC' }}>{tecAtivos}</td>
                        <td style={{ textAlign: 'center', fontWeight: 'bold', color: 'var(--green-light)' }}>{tecConcluidos}</td>
                        <td style={{ textAlign: 'center' }}>{totalTec}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span className="status-badge" style={{
                            background: eficiencia >= 70 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: eficiencia >= 70 ? '#34D399' : '#FBBF24',
                            border: eficiencia >= 70 ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
                          }}>
                            {eficiencia}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

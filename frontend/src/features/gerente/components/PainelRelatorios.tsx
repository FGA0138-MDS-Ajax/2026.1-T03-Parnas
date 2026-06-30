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

  // 2. Cálculos de Categoria (Hidráulica, Elétrica, Refrigeração, Equipamentos, Infraestrutura, Outros)
  const getVolumetriaCategoria = (cat: string) => {
    return chamados.filter(c => c.tipo_manutencao.toLowerCase().includes(cat.toLowerCase())).length;
  };

  const catHidraulica = getVolumetriaCategoria('hidráulica');
  const catEletrica = getVolumetriaCategoria('elétrica') + getVolumetriaCategoria('iluminação');
  const catRefrigeracao = getVolumetriaCategoria('refrigeração');
  const catEquipamentos = getVolumetriaCategoria('equipamentos');
  const catInfraestrutura = getVolumetriaCategoria('infraestrutura');
  const catOutros = total - (catHidraulica + catEletrica + catRefrigeracao + catEquipamentos + catInfraestrutura);

  const maxCatVal = Math.max(catHidraulica, catEletrica, catRefrigeracao, catEquipamentos, catInfraestrutura, catOutros, 1);
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
      // Carregar dinamicamente a biblioteca jsPDF
      const jsPDF = (await import('jspdf')).default;
      
      // Criar documento PDF
      const doc = new jsPDF();
      
      // Adicionar título
      doc.setFontSize(20);
      doc.text('Relatório Mensal de Manutenção', 20, 20);
      
      // Adicionar data
      doc.setFontSize(12);
      doc.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, 20, 35);
      
      // Adicionar estatísticas principais
      doc.setFontSize(16);
      doc.text('Estatísticas Gerais', 20, 50);
      
      doc.setFontSize(12);
      doc.text(`Total de Chamados: ${total}`, 20, 60);
      doc.text(`Concluídos: ${concluidos}`, 20, 70);
      doc.text(`Em Curso: ${emCurso}`, 20, 80);
      doc.text(`Abertos: ${abertos}`, 20, 90);
      doc.text(`Taxa de Resolução: ${taxaResolucao}%`, 20, 100);
      
      // Adicionar categorias
      doc.setFontSize(16);
      doc.text('Volumetria por Categoria', 20, 115);
      
      doc.setFontSize(12);
      doc.text(`Hidráulica: ${catHidraulica}`, 20, 125);
      doc.text(`Elétrica/Iluminação: ${catEletrica}`, 20, 135);
      doc.text(`Refrigeração: ${catRefrigeracao}`, 20, 145);
      doc.text(`Outros: ${catOutros}`, 20, 155);
      
      // Adicionar tabela de técnicos
      doc.setFontSize(16);
      doc.text('Desempenho por Técnico', 20, 170);
      
      let yPos = 180;
      doc.setFontSize(12);
      for (let i = 0; i < tecnicos.length && yPos < 250; i++) {
        const tec = tecnicos[i];
        const tecTickets = chamados.filter(c => c.tecnico_id === tec.matricula);
        const tecConcluidos = tecTickets.filter(c => c.status === 'CONCLUIDO').length;
        const totalTec = tecTickets.length;
        const eficiencia = totalTec > 0 ? Math.round((tecConcluidos / totalTec) * 100) : 100;
        
        doc.text(`${tec.nome} (${tec.matricula}): ${eficiencia}% de eficiência`, 20, yPos);
        yPos += 10;
        
        if (yPos >= 250) {
          doc.addPage();
          yPos = 20;
        }
      }
      
      // Salvar o PDF
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
                  <span className="bar-label">💧 Hidráulica</span>
                  <div className="bar-track">
                    <div className="bar-fill hydraulic" style={{ width: getWidthPercent(catHidraulica) }}></div>
                  </div>
                  <span className="bar-value">{catHidraulica}</span>
                </div>

                <div className="bar-chart-row">
                  <span className="bar-label">⚡ Elétrica / Iluminação</span>
                  <div className="bar-track">
                    <div className="bar-fill electric" style={{ width: getWidthPercent(catEletrica) }}></div>
                  </div>
                  <span className="bar-value">{catEletrica}</span>
                </div>

                <div className="bar-chart-row">
                  <span className="bar-label">❄️ Refrigeração</span>
                  <div className="bar-track">
                    <div className="bar-fill refrigeration" style={{ width: getWidthPercent(catRefrigeracao) }}></div>
                  </div>
                  <span className="bar-value">{catRefrigeracao}</span>
                </div>

                <div className="bar-chart-row">
                  <span className="bar-label">📦 Equipamentos</span>
                  <div className="bar-track">
                    <div className="bar-fill equipments" style={{ width: getWidthPercent(catEquipamentos) }}></div>
                  </div>
                  <span className="bar-value">{catEquipamentos}</span>
                </div>

                <div className="bar-chart-row">
                  <span className="bar-label">🏢 Infraestrutura</span>
                  <div className="bar-track">
                    <div className="bar-fill infrastructure" style={{ width: getWidthPercent(catInfraestrutura) }}></div>
                  </div>
                  <span className="bar-value">{catInfraestrutura}</span>
                </div>

                <div className="bar-chart-row">
                  <span className="bar-label">🛠️ Outros Serviços</span>
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

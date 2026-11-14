import { lazy, Suspense, useEffect, useReducer, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { AstralMark, Icon } from './components/Icon';
import type { IconName } from './components/Icon';
import { getCurrentMission, getProgress, getTelemetry, getSimulationEvents, initialState, reducer, restoreState, MISSIONS, MISSION_STAGES, SCIENCE_SOURCES, STORAGE_KEY } from './domain/mission';
import type { TelemetryMetric } from './domain/mission';
import { EQUIPMENT, RISKS, SOURCES, STANDARDS } from './data/science';

const SpaceScene = lazy(() => import('./components/SpaceScene'));
type Page = 'mission'|'monitor'|'science'|'equipment';
const NAV: {id:Page;label:string;icon:IconName;number:string}[] = [
  {id:'mission',label:'Sua missão',icon:'orbit',number:'01'},
  {id:'monitor',label:'Monitoramento',icon:'pulse',number:'02'},
  {id:'science',label:'Base científica',icon:'book',number:'03'},
  {id:'equipment',label:'Tecnologia',icon:'layers',number:'04'},
];

function loadState() {
  try { const raw = localStorage.getItem(STORAGE_KEY); return raw ? restoreState(JSON.parse(raw)) : initialState(); }
  catch { return initialState(); }
}
function loadStarted() { try { return localStorage.getItem('astral-vitais.started') === 'true'; } catch { return false; } }
function clock(seconds:number) { return `${Math.floor(seconds/3600).toString().padStart(2,'0')}:${Math.floor(seconds/60%60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}`; }
function formatValue(value:number|null) { return value === null ? '—' : value.toLocaleString('pt-BR',{maximumFractionDigits:2}); }

function Sparkline({metric,large=false}:{metric:TelemetryMetric;large?:boolean}) {
  const values = metric.trend;
  if(metric.status!=='valid') return <div className={`missing-signal ${large?'large':''}`}><span/>{metric.status==='stale'?'Leitura anterior · sem atualização':'Sem leitura válida'}<span/></div>;
  const min = Math.min(...values), max = Math.max(...values), span = Math.max(max-min,.1);
  const points=values.map((v,i)=>`${i/(Math.max(values.length-1,1))*280},${60-(v-min)/span*40}`).join(' ');
  return <svg className={`sparkline ${large?'large':''}`} viewBox="0 0 280 75" preserveAspectRatio="none" role="img" aria-label={`Tendência simulada de ${metric.label}`}><path className="chart-grid" d="M0 15H280M0 40H280M0 65H280"/><polygon className="chart-fill" points={`0,75 ${points} 280,75`}/><polyline points={points}/></svg>;
}

const metricIcon: Record<string,IconName> = {heartRate:'heart',oxygenSaturation:'lungs',bodyTemperature:'temp',carbonDioxide:'signal',radiation:'sun',sleep:'moon'};
function MetricCard({metric,compact=false,onClick}:{metric:TelemetryMetric;compact?:boolean;onClick?:()=>void}) {
  return <button type="button" className={`metric-card ${metric.status!=='valid'?'signal-warning':''} ${compact?'compact':''}`} onClick={onClick} aria-label={`${metric.label}: ${formatValue(metric.value)} ${metric.unit}. ${metric.status==='valid'?'Sinal válido':metric.status==='stale'?'Leitura antiga':'Sinal inválido'}. Abrir detalhes`}>
    <div className="metric-top"><span><Icon name={metricIcon[metric.id]??'pulse'} size={16}/>{metric.label}</span><span className="metric-dot"/></div>
    <div className="metric-value">{formatValue(metric.value)}<span>{metric.unit}</span></div>
    <Sparkline metric={metric}/>
    <div className="metric-bottom"><span>{metric.status==='valid'?'SINAL VÁLIDO':metric.status==='stale'?'DADO ANTIGO':'SEM LEITURA'}</span><Icon name="diagonal" size={14}/></div>
  </button>;
}

export default function App() {
  const [state,dispatch]=useReducer(reducer,undefined,loadState);
  const [page,setPage]=useState<Page>('mission');
  const [started,setStarted]=useState(loadStarted);
  const [paused,setPaused]=useState(false);
  const [audioOn,setAudioOn]=useState(false);
  const [sceneMode,setSceneMode]=useState<'orbit'|'crew'>('orbit');
  const [selectedChoice,setSelectedChoice]=useState<string|null>(null);
  const [riskId,setRiskId]=useState(RISKS[0]?.id??'');
  const [selectedMetric,setSelectedMetric]=useState('heartRate');
  const [storageWarning,setStorageWarning]=useState(false);
  const [toast,setToast]=useState('');
  const [reducedMotion,setReducedMotion]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const resetDialog = useRef<HTMLDialogElement>(null);
  const feedbackRef=useRef<HTMLDivElement>(null);
  const audioContext=useRef<AudioContext|null>(null);
  const mainRef=useRef<HTMLElement>(null);
  const persistedCheckpoint=useRef('');
  const mission=getCurrentMission(state), progress=getProgress(state), metrics=getTelemetry(state);
  const activeMetric=metrics.find(m=>m.id===selectedMetric)??metrics[0];
  const activeRisk=RISKS.find(r=>r.id===riskId)??RISKS[0];
  const events=getSimulationEvents(state);
  const alertActive=started&&mission.id==='radiation'&&state.feedback?.outcome!=='recommended';

  useEffect(()=>{
    const checkpoint=[state.missionIndex,state.responses.length,state.complete,started,Math.floor(state.elapsedSeconds/5)].join(':');
    if(checkpoint===persistedCheckpoint.current)return;
    try { localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); localStorage.setItem('astral-vitais.started',String(started)); persistedCheckpoint.current=checkpoint; }
    catch {setStorageWarning(true);}
  },[state,started]);
  useEffect(()=>{
    if(!started||paused||state.complete||!(page==='mission'||page==='monitor'))return;
    const timer=window.setInterval(()=>{if(!document.hidden)dispatch({type:'TICK',seconds:1});},1000);
    return ()=>window.clearInterval(timer);
  },[started,paused,state.complete,page]);
  useEffect(()=>{setSelectedChoice(null);},[state.missionIndex]);
  useEffect(()=>{if(state.feedback)feedbackRef.current?.focus({preventScroll:true});},[state.feedback]);
  useEffect(()=>{if(!toast)return;const t=window.setTimeout(()=>setToast(''),4500);return()=>clearTimeout(t);},[toast]);
  useEffect(()=>{
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');const change=()=>setReducedMotion(media.matches);
    media.addEventListener('change',change);return()=>media.removeEventListener('change',change);
  },[]);
  useEffect(()=>()=>{void audioContext.current?.close();},[]);

  function navigate(next:Page) {setPage(next);window.scrollTo({top:0,behavior:'instant'});requestAnimationFrame(()=>mainRef.current?.focus({preventScroll:true}));}
  function start() {setStarted(true);setPaused(false);}
  function reset() {dispatch({type:'RESET'});setStarted(false);setPaused(false);setSelectedChoice(null);resetDialog.current?.close();setToast('Nova missão preparada. Seus registros anteriores foram apagados deste navegador.');}
  async function toggleSound() {
    try {
      if(audioContext.current){await audioContext.current.close();audioContext.current=null;setAudioOn(false);return;}
      const ctx=new AudioContext();audioContext.current=ctx;const gain=ctx.createGain();gain.gain.value=.018;gain.connect(ctx.destination);
      [55,82.41,110].forEach((f,i)=>{const osc=ctx.createOscillator();osc.type='sine';osc.frequency.value=f;osc.detune.value=i*2;osc.connect(gain);osc.start();});
      await ctx.resume();setAudioOn(true);
    } catch {setToast('O áudio não está disponível neste navegador.');setAudioOn(false);}
  }
  async function fullscreen() {
    try {if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}
    catch {setToast('Tela cheia indisponível. A missão continua nesta janela.');}
  }
  function exportLog() {
    const data={project:'ASTRAL VITAIS',type:'educational-simulation',version:'0.1.0-beta.1',exportedAt:new Date().toISOString(),notice:'Dados sintéticos. Pontuação educativa; não representa saúde, aptidão ou certificação.',progress,mission:state,telemetry:metrics};
    const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download='astral-vitais-diario.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);setToast('Diário da simulação exportado.');
  }

  return <div className={`app-shell ${reducedMotion?'reduce-motion':''}`}>
    <a className="skip-link" href="#main">Ir para o conteúdo</a>
    <header className="topbar">
      <button type="button" className="brand" aria-label="ASTRAL VITAIS, início" onClick={()=>navigate('mission')}><AstralMark/><span>ASTRAL<span className="brand-sub">VITAIS</span></span><span className="beta">BETA</span></button>
      <nav className="main-nav" aria-label="Navegação principal">{NAV.map(item=><button type="button" key={item.id} aria-current={page===item.id?'page':undefined} className={page===item.id?'active':''} onClick={()=>navigate(item.id)}><span className="nav-number">{item.number}</span><Icon name={item.icon} size={17}/><span>{item.label}</span></button>)}</nav>
      <div className="topbar-right"><span className="sim-badge"><i/>SIMULAÇÃO</span><span className="team-monogram">AV</span></div>
    </header>

    <main id="main" ref={mainRef} tabIndex={-1}>
      {page==='mission'&&<>
        <section className={`mission-deck ${started?'in-mission':''} ${alertActive?'solar-event':''}`} aria-labelledby="mission-heading">
          <div className="deck-grid" aria-hidden="true"/>
          <div className="scene-wrap" aria-label="Representação artística 3D da Terra e de um astronauta. A nave e as distâncias não estão em escala.">
            <Suspense fallback={<div className="scene-loading"><div className="orbital-loader"/><span>Preparando o horizonte</span></div>}><SpaceScene paused={paused||reducedMotion} mode={sceneMode} alert={alertActive}/></Suspense>
          </div>
          <div className="deck-label"><span className="dot"/>{!started?'CENTRO DE TREINAMENTO':mission.stage==='preflight'?'PREPARAÇÃO EM TERRA':mission.stage==='return'?'RECUPERAÇÃO EM TERRA':'ÓRBITA TERRESTRE SIMULADA'}<span className="divider"/>AV–01</div>
          <div className="orbit-coordinates" aria-hidden="true"><span>SCENE / 03D</span><span>EARTH · HOME</span><b>+</b></div>
          {!started?<div className="hero-copy"><p className="eyebrow">A PRÓXIMA FRONTEIRA É HUMANA</p><h1 id="mission-heading">Longe da Terra.<br/>Perto da <em>vida.</em></h1><p className="hero-description">O espaço muda o corpo.<br/>Suas decisões mudam a missão.</p><p className="hero-support">Assuma o cuidado da tripulação. Observe os sinais, pratique a prevenção e descubra a ciência por trás de cada escolha.</p><button className="button primary start-button" onClick={start}><span>Iniciar minha missão</span><Icon name="arrow"/></button><div className="hero-meta"><span><Icon name="orbit" size={14}/>9 desafios</span><span>3 fases de missão</span><span>No seu ritmo</span></div></div>:state.complete?<div className="completion-card"><div className="completion-symbol"><AstralMark size={52}/></div><p className="eyebrow">MISSÃO CONCLUÍDA</p><h1 id="mission-heading">Você trouxe<br/>o cuidado de volta.</h1><p>As decisões terminam aqui. A prevenção continua antes, durante e depois de cada voo.</p><div className="result-score"><strong>{progress.score}<span>/100</span></strong><span>PONTUAÇÃO EDUCATIVA<br/>Não mede saúde ou aptidão.</span></div><div className="completion-actions"><button className="button primary" onClick={exportLog}>Salvar diário<Icon name="download" size={17}/></button><button className="button secondary" onClick={()=>resetDialog.current?.showModal()}>Nova missão<Icon name="restart" size={17}/></button></div></div>:<div className="scenario-card" key={mission.id}>
            <div className="scenario-kicker"><span>{String(state.missionIndex+1).padStart(2,'0')} / 09</span><span>{mission.category}</span><Icon name={metricIcon[mission.id]??'orbit'} size={17}/></div>
            <h1 id="mission-heading">{mission.title}</h1><p className="briefing">{mission.briefing}</p>
            {!state.feedback?<><h2 className="question">{mission.question}</h2><div className="choices" role="group" aria-label="Escolha seu procedimento">{mission.choices.map((choice,i)=><button type="button" key={choice.id} className={`choice ${selectedChoice===choice.id?'selected':''}`} aria-pressed={selectedChoice===choice.id} onClick={()=>setSelectedChoice(choice.id)} disabled={paused}><span className="choice-letter">{String.fromCharCode(65+i)}</span><span><strong>{choice.label}</strong><small>{choice.detail}</small></span><span className="choice-selector">{selectedChoice===choice.id&&<Icon name="check" size={12}/>}</span></button>)}</div><button className="button primary execute-button" disabled={!selectedChoice||paused} onClick={()=>selectedChoice&&dispatch({type:'ANSWER',choiceId:selectedChoice})}>{paused?'Missão pausada':'Executar procedimento'}<Icon name="arrow" size={18}/></button></>:<div ref={feedbackRef} tabIndex={-1} className={`feedback ${state.feedback.outcome}`} aria-live="polite"><div className="feedback-heading"><Icon name={state.feedback.outcome==='recommended'?'check':'info'} size={22}/><h2>{state.feedback.title}</h2></div><p>{state.feedback.message}</p><div className="why"><span>O QUE A CIÊNCIA EXPLICA</span><p>{state.feedback.why}</p></div><div className="feedback-sources">{mission.sourceIds.map(id=>{const source=SCIENCE_SOURCES[id as keyof typeof SCIENCE_SOURCES];return source?<a key={id} href={source.url} target="_blank" rel="noreferrer">{source.title}<Icon name="diagonal" size={12}/></a>:null;})}</div><button className="button primary" disabled={paused} onClick={()=>dispatch({type:'NEXT'})}>{state.missionIndex===8?'Concluir missão':'Próximo desafio'}<Icon name="arrow" size={18}/></button></div>}
          </div>}
          <div className="scene-label"><span className="crosshair">+</span><div><strong>{sceneMode==='orbit'?'TERRA, NOSSO PONTO DE PARTIDA':'TRIPULANTE AV–01'}</strong><span>{sceneMode==='orbit'?'Um lugar para voltar. Um motivo para cuidar.':'Modelo ilustrativo · identidade fictícia'}</span></div></div>
          <div className="scene-controls"><div className="scene-toggle" role="group" aria-label="Visualização 3D"><button className={sceneMode==='orbit'?'selected':''} aria-pressed={sceneMode==='orbit'} onClick={()=>setSceneMode('orbit')}><Icon name="orbit" size={15}/>Órbita</button><button className={sceneMode==='crew'?'selected':''} aria-pressed={sceneMode==='crew'} onClick={()=>setSceneMode('crew')}><Icon name="astronaut" size={15}/>Tripulante</button></div><button className="icon-button" aria-label={audioOn?'Desativar som ambiente':'Ativar som ambiente'} aria-pressed={audioOn} onClick={()=>void toggleSound()}><Icon name={audioOn?'volume':'mute'} size={17}/></button><button className="icon-button" aria-label={paused?'Retomar simulação e animação':'Pausar simulação e animação'} aria-pressed={paused} onClick={()=>setPaused(p=>!p)}><Icon name={paused?'play':'pause'} size={17}/></button><button className="icon-button fullscreen" aria-label="Alternar tela cheia" onClick={()=>void fullscreen()}><Icon name="expand" size={17}/></button></div>
          {alertActive&&<div className="solar-notice" role="status"><Icon name="sun" size={17}/>EVENTO SOLAR SIMULADO · PROTOCOLO ATIVO</div>}
        </section>

        <section className="mission-status" aria-label="Progresso da missão"><div className="mission-code"><span>EXPEDIÇÃO</span><strong>VITAL–01</strong></div><div className="phase-track">{MISSION_STAGES.map((stage,i)=>{const stageMissions=MISSIONS.filter(m=>m.stage===stage.id),completed=stageMissions.every(m=>state.responses.some(r=>r.missionId===m.id));return <div key={stage.id} className={`phase ${started&&mission.stage===stage.id&&!state.complete?'current':''} ${completed?'done':''}`}><span className="phase-node">{completed?<Icon name="check" size={13}/>:String(i+1).padStart(2,'0')}</span><div><strong>{stage.title}</strong><small>{stage.subtitle}</small></div>{i<2&&<div className="phase-line"/>}</div>})}</div><div className="time-block"><span>TEMPO DE SIMULAÇÃO</span><strong>{clock(state.elapsedSeconds)}</strong></div></section>

        <section className="telemetry-section"><div className="section-heading"><div><span className="section-index">01 — OBSERVAR</span><h2>Cada sinal conta uma história.</h2></div><button className="text-button" onClick={()=>navigate('monitor')}>Abrir monitoramento<Icon name="arrow" size={17}/></button></div><div className="telemetry-grid">{metrics.slice(0,4).map(metric=><MetricCard key={metric.id} metric={metric} compact onClick={()=>{setSelectedMetric(metric.id);navigate('monitor');}}/>)}</div><div className="data-caption"><Icon name="info" size={14}/><span>Todos os valores são sintéticos. Sinal válido indica qualidade da leitura, não condição de saúde.</span><span>TELEMETRIA DEMO / AV–01</span></div></section>

        <section className="discovery-strip"><div><span className="section-index">02 — COMPREENDER</span><h2>Prevenção começa com contexto.</h2><p>Descubra os riscos, os requisitos e as tecnologias que inspiram esta missão.</p></div><button className="discovery-link" onClick={()=>navigate('science')}><span className="discovery-icon"><Icon name="book" size={24}/></span><span><strong>A ciência do cuidado</strong><small>NASA · SOMA · contramedidas</small></span><Icon name="diagonal"/></button><button className="discovery-link" onClick={()=>navigate('equipment')}><span className="discovery-icon"><Icon name="layers" size={24}/></span><span><strong>De Mercury ao futuro</strong><small>Uma história de evolução</small></span><Icon name="diagonal"/></button></section>
      </>}

      {page==='monitor'&&<div className="content-page monitor-page"><PageHeading eyebrow="OBSERVAR ANTES DE INTERPRETAR" title="Sinais com contexto." description="Leitura, origem e qualidade lado a lado. Acompanhe a telemetria da missão e veja quando um dado precisa ser verificado."/><div className="monitor-toolbar"><span className="sim-badge"><i/>DADOS SINTÉTICOS</span><span>AV–01 · {MISSION_STAGES.find(s=>s.id===mission.stage)?.title} · {clock(state.elapsedSeconds)}</span><button className="text-button" onClick={exportLog}><Icon name="download" size={16}/>Exportar diário</button><button className="button secondary small" onClick={()=>setPaused(p=>!p)}><Icon name={paused?'play':'pause'} size={15}/>{paused?'Retomar':'Pausar'}</button></div><div className="monitor-grid">{metrics.map(metric=><MetricCard key={metric.id} metric={metric} onClick={()=>setSelectedMetric(metric.id)}/>)}</div><div className="monitor-details"><section className="detail-chart"><div className="section-heading"><div><span className="eyebrow">TENDÊNCIA SIMULADA</span><h2>{activeMetric.label}</h2></div><strong>{formatValue(activeMetric.value)} <small>{activeMetric.unit}</small></strong></div><Sparkline metric={activeMetric} large/><div className="chart-time"><span>Histórico sintético ilustrativo</span><span>LEITURA SELECIONADA</span></div><p>{activeMetric.context}</p><dl className="signal-metadata"><div><dt>Qualidade</dt><dd>{Math.round(activeMetric.quality*100)}% · sintética</dd></div><div><dt>Horário da amostra</dt><dd>{new Date(activeMetric.timestamp).toLocaleTimeString('pt-BR',{timeZone:'UTC'})} UTC simulado</dd></div><div><dt>Idade da leitura</dt><dd>{activeMetric.ageSeconds}s</dd></div></dl></section><section className="event-log"><div className="section-heading"><div><span className="eyebrow">DIÁRIO OPERACIONAL</span><h2>O que está acontecendo</h2></div><Icon name="signal"/></div><div className="event-list">{events.map((event,index)=><div className="event" key={index}><span className="event-marker"/><div><strong>{event.title}</strong><p>{event.description}</p></div></div>)}</div><div className="context-note"><Icon name="shield" size={20}/><p>Um valor isolado não decide pela tripulação. A ação depende de contexto, validade da medição e protocolo.</p></div><button className="button secondary" onClick={()=>navigate('mission')}>Voltar à missão<Icon name="arrow" size={16}/></button></section></div></div>}

      {page==='science'&&<div className="content-page science-page"><PageHeading eyebrow="EVIDÊNCIAS, NÃO SUPOSIÇÕES" title="Ciência para cuidar mais longe." description="O corpo foi feito para a Terra. Entender o que muda no espaço é o primeiro passo para desenhar proteção, rotina e autonomia."/><div className="science-intro"><div className="science-number">05<span>PERIGOS FUNDAMENTAIS</span></div><p>Radiação. Isolamento e confinamento. Distância da Terra. Gravidade alterada. Ambientes fechados ou hostis.<br/><a href="https://www.nasa.gov/hrp/hazards/" target="_blank" rel="noreferrer">Explorar a estrutura do NASA Human Research Program<Icon name="diagonal" size={14}/></a></p></div><section className="risk-explorer"><div className="risk-tabs" role="group" aria-label="Explorar riscos de saúde">{RISKS.map((risk,i)=><button key={risk.id} className={riskId===risk.id?'active':''} aria-pressed={riskId===risk.id} onClick={()=>setRiskId(risk.id)}><span>{String(i+1).padStart(2,'0')}</span>{risk.title}<Icon name="chevron" size={15}/></button>)}</div><article className="risk-content" key={activeRisk.id}><span className="eyebrow">{activeRisk.tag}</span><h2>{activeRisk.title}</h2><p className="risk-mechanism">{activeRisk.mechanism}</p><div className="risk-actions"><div><span>ANTES DO VOO</span><p>{activeRisk.preflight}</p></div><div><span>DURANTE A MISSÃO</span><p>{activeRisk.practice}</p></div></div><div className="evidence-limit"><Icon name="info" size={18}/><p>{activeRisk.limitation}</p></div><a className="text-button" href={activeRisk.sourceUrl} target="_blank" rel="noreferrer">{activeRisk.sourceLabel}<Icon name="diagonal" size={15}/></a></article></section><section className="standards-section"><div className="section-heading"><div><span className="section-index">REFERÊNCIAS DE PROJETO</span><h2>Requisitos têm unidade, janela e contexto.</h2></div></div><p className="standards-intro">NASA-STD-3001: Volume 1, revisão C (2023); Volume 2, revisão F (2026). Estes exemplos orientam o projeto. Não são um certificado de conformidade deste protótipo.</p><div className="standards-grid">{STANDARDS.map(item=><a key={item.code} href={item.url} target="_blank" rel="noreferrer" className="standard-card"><div><span>{item.code}</span><Icon name="diagonal" size={17}/></div><h3>{item.title}</h3><strong>{item.value}</strong><p>{item.scope}</p></a>)}</div></section><section className="sources-section"><div className="section-heading"><div><span className="section-index">BIBLIOTECA DE EVIDÊNCIAS</span><h2>Abra a fonte. Faça sua própria leitura.</h2></div><span className="source-count">{SOURCES.length} FONTES SELECIONADAS</span></div><div className="source-list">{SOURCES.map((source,i)=><a key={source.id} href={source.url} target="_blank" rel="noreferrer"><span className="source-number">{String(i+1).padStart(2,'0')}</span><div><span className="source-meta">{source.organization} · {source.year} · {source.kind}</span><h3>{source.title}</h3><p>{source.summary}</p></div><Icon name="diagonal" size={21}/></a>)}</div></section></div>}

      {page==='equipment'&&<div className="content-page equipment-page"><PageHeading eyebrow="ENGENHARIA A SERVIÇO DA VIDA" title="Medir melhor. Cuidar mais longe." description="De eletrodos conectados à Terra a laboratórios compactos em órbita: a evolução dos aparelhos também é uma evolução da autonomia."/><div className="equipment-hero"><div className="instrument-graphic" aria-hidden="true"><div className="instrument-ring r1"/><div className="instrument-ring r2"/><div className="instrument-core"><Icon name="pulse" size={96}/></div><span className="instrument-corner c1">SENSOR ARRAY</span><span className="instrument-corner c2">VITAL SYSTEMS / 01</span></div><div><p className="eyebrow">DO SINAL AO CONTEXTO</p><h2>O instrumento evolui.<br/>A pergunta permanece.</h2><p>O que está mudando no corpo — e qual é a próxima ação responsável?</p><div className="equipment-legend"><span><i/>Uso em missão</span><span><i/>Pesquisa e demonstração</span></div></div></div><div className="equipment-timeline">{EQUIPMENT.map((item,i)=><article key={item.title} className="equipment-item"><div className="equipment-year"><span>{item.year}</span><i/></div><div className="equipment-content"><div className="equipment-meta"><span>{item.category}</span><span>{item.status}</span></div><h2>{item.title}</h2><p>{item.description}</p><div className="equipment-change"><span>O QUE MUDOU</span><p>{item.change}</p></div><a className="text-button" href={item.url} target="_blank" rel="noreferrer">Consultar fonte primária<Icon name="diagonal" size={14}/></a></div><span className="equipment-index">{String(i+1).padStart(2,'0')}</span></article>)}</div><div className="future-note"><Icon name="layers" size={28}/><div><h2>O próximo salto é integrar com responsabilidade.</h2><p>Instrumentos medem coisas diferentes, em intervalos diferentes. O SOMA reúne pesquisa multiômica; ele não é um fluxo de sinais vitais em tempo real nem fornece limiares clínicos validados.</p></div><button className="button secondary" onClick={()=>navigate('science')}>Explorar evidências<Icon name="arrow" size={17}/></button></div></div>}
    </main>

    <footer className="footer"><div className="footer-brand"><AstralMark size={25}/><span>ASTRAL VITAIS<span>UMA MISSÃO PELA VIDA.</span></span></div><p>Uma criação da equipe <strong>ASTRAL VITAL</strong>.<br/>Protótipo educativo independente · sem vínculo ou certificação NASA.</p><div className="footer-links"><a href="https://github.com/oalexandrebelo/ASTRAL-VITAIS" target="_blank" rel="noreferrer">Código aberto<Icon name="diagonal" size={14}/></a><button onClick={()=>resetDialog.current?.showModal()}>Reiniciar missão<Icon name="restart" size={14}/></button><span>v0.1.0 BETA · PT-BR</span></div></footer>
    {storageWarning&&<div className="storage-warning" role="status">O navegador não permite salvar progresso. Sua missão continua nesta sessão.</div>}
    {toast&&<div className="toast" role="status"><Icon name="info" size={18}/>{toast}<button aria-label="Fechar aviso" onClick={()=>setToast('')}><Icon name="close" size={16}/></button></div>}
    <dialog ref={resetDialog} className="reset-dialog"><button className="dialog-close icon-button" aria-label="Fechar" onClick={()=>resetDialog.current?.close()}><Icon name="close"/></button><Icon name="restart" size={32}/><h2>Preparar uma nova missão?</h2><p>O progresso e as decisões desta simulação serão apagados deste navegador. Você pode exportar o diário antes.</p><div className="dialog-actions"><button className="button secondary" onClick={exportLog}>Exportar diário</button><button className="button primary" onClick={reset}>Reiniciar</button></div></dialog>
    <div className="scroll-progress" style={{'--progress':`${progress.percent}%`} as CSSProperties} aria-hidden="true"/>
  </div>;
}

function PageHeading({eyebrow,title,description}:{eyebrow:string;title:string;description:string}) {
  return <header className="page-heading"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></header>;
}

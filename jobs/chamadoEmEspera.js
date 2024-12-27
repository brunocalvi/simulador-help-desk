const Queue = require('bull');

module.exports = (app) => {
  const REDIS_CONFIG = {
    host: '127.0.0.1',
    port: 6379,
  };

  const MAX_WAITING_COUNT = 2;

  const JOB_OPTIONS = {
    attempts: 3, // Tentativas em caso de falha
    backoff: 1000, // Tempo de espera entre tentativas (ms)
    //delay: 120000, // Atraso de 2 minutos (em milissegundos)
    delay: 60000,
  };

  let filaPausada = false;

  // Configura a fila no Redis
  const emEspera = new Queue('chamadoEmEspera', { redis: REDIS_CONFIG });

  // Eventos de monitoramento
  emEspera.on('failed', (job, err) => {
    console.error(`[Erro] Job da fila chamado falhou! ID: ${job.id}, Razão: ${err.message}`);
  });

  emEspera.on('completed', (job) => {
    console.log(`[Sucesso] Job da fila chamado concluído! ID: ${job.id}`);
  });

  // Adiciona uma tarefa à fila
  async function addNaFila(tarefa) {
    if (filaPausada) {
      console.log('[Aviso] Fila de chamados está pausada. redirecionando para fila de espera.');
      // Enviado para a fila de espera pq a de chamado esta cheia
      app.jobs.filaDeEspera.addFilaEspera(tarefa);
      return 'Fila de chamados está pausada. redirecionando para fila de espera.';
    }

    // Conta jobs em espera e atrasados
    const waitingCount = await emEspera.getWaitingCount();
    const delayedCount = await emEspera.getDelayedCount();
    const totalJobs = waitingCount + delayedCount;

    if (totalJobs >= MAX_WAITING_COUNT) {
      filaPausada = true;
      console.log('[Aviso] Fila de chamados atingiu o limite. redirecionando para fila de espera.');
      // Enviado para a fila de espera pq a de chamado esta cheia
      app.jobs.filaDeEspera.addFilaEspera(tarefa);
      return 'Fila de chamados atingiu o limite. redirecionando para fila de espera.';
    }

    const job = await emEspera.add(tarefa, JOB_OPTIONS);
    console.log(`[Info] Tarefa adicionada à fila de chamado. Job ID: ${job.id}`);
    return job.id;
  }

  // Define o processador de jobs da fila (chamado apenas uma vez)
  emEspera.process(1, async (job) => {
    try {
      job.data.estado_chamado = 'EA';
      job.data.motivo_chamado = 'Chamado inserido pela fila de chamado.';

      console.log(`[Info] Processando job da fila de chamado, ID: ${job.id}`);
      //console.log(`[Info] Serial Number: ${job.data.serial_number}`);

      // salva o que foi processado no BD
      await app.controllers.chamado.addChamado(job.data);

      // Verifica se a fila deve ser reativada
      // Conta jobs em espera e atrasados
      const waitingCount = await emEspera.getWaitingCount();
      const delayedCount = await emEspera.getDelayedCount();
      const totalJobs = waitingCount + delayedCount;

      if (filaPausada && totalJobs < MAX_WAITING_COUNT) {
        filaPausada = false;
        console.log('[Info] Fila de chamado reativada.');
      }
    } catch (err) {
      console.error(`[Erro] Falha ao processar job da fila de chamado, ID: ${job.id}, Razão: ${err.message}`);
    }
  });

  return { addNaFila };
};

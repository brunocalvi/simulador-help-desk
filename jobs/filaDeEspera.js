const Queue = require('bull');

module.exports = (app) => {
  const REDIS_CONFIG = {
    host: '127.0.0.1',
    port: 6379,
  };

  const JOB_OPTIONS = {
    attempts: 3, // Tentativas em caso de falha
    backoff: 1000, // Tempo de espera entre tentativas (ms)
    //delay: 180000, // Atraso de 3 minutos (em milissegundos)
    delay: 60000,
  };

  // Configura a fila no Redis
  const filaDeEspera = new Queue('filaDeEspera', { redis: REDIS_CONFIG });

  // Eventos de monitoramento
  filaDeEspera.on('failed', (job, err) => {
    console.error(`[Erro] Job da fila de espera falhou! ID: ${job.id}, Razão: ${err.message}`);
  });

  filaDeEspera.on('completed', (job) => {
    console.log(`[Sucesso] Job da fila de espera concluído! ID: ${job.id}`);
  });

  // Adiciona uma tarefa à fila
  async function addFilaEspera(tarefa) {
    const job = await filaDeEspera.add(tarefa, JOB_OPTIONS);
    console.log(`[Info] Tarefa adicionada à fila de espera. Job ID: ${job.id}`);
    return job.id;
  }

  // Define o processador de jobs da fila (chamado apenas uma vez)
  filaDeEspera.process(1, async (job) => {
    try {
      job.data.estado_chamado = 'AB';
      job.data.motivo_chamado = 'Chamado inserido pela fila de espera.';

      console.log(`[Info] Processando job da fila de espera, ID: ${job.id}`);

      // salva o que foi processado no BD
      await app.controllers.chamado.addChamado(job.data);

    } catch (err) {
      console.error(`[Erro] Falha ao processar job da fila de espera, ID: ${job.id}, Razão: ${err.message}`);
    }
  });

  return { addFilaEspera };
};

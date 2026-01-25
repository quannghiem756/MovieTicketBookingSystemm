import api from './api';

export const createTicket = async (ticketData: any) => {
  const response = await api.post('/support/tickets', ticketData);
  return response.data;
};

export const getTicketByToken = async (token: string) => {
  const response = await api.get(`/support/public/${token}`);
  return response.data;
};

export const replyToTicket = async (token: string, content: string) => {
  const response = await api.post(`/support/public/${token}/reply`, { content });
  return response.data;
};

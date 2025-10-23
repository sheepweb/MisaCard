export interface CardInfo {
  card_number: number | null;
  id: string;
  card_nickname: string;
  card_cvc: string | null;
  exp_date: number;
  create_time: string;
  card_limit: number;
  card_exp_date: string | null;
  status: string;
  delete_date?: string | null;
  card_activation_time?: string | null;
  billing_address?: string | null;
}

export interface ApiResponse {
  result: CardInfo | null;
  msg: string | null;
  error: string | null;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      merchants: {
        Row: {
          id: string
          name: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      agents: {
        Row: {
          id: string
          merchant_id: string
          name: string
          type: string
          status: string
          risk_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          merchant_id: string
          name: string
          type: string
          status?: string
          risk_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          merchant_id?: string
          name?: string
          type?: string
          status?: string
          risk_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          intent_id: string | null
          merchant_id: string
          agent_id: string
          amount: number
          currency: string
          status: 'PROPOSED' | 'EVALUATING' | 'APPROVED' | 'BLOCKED' | 'PENDING_REVIEW' | 'REJECTED' | 'EXECUTING' | 'EXECUTED' | 'FAILED' | 'SETTLED' | 'RECONCILED' | 'CANCELLED'
          idempotency_key: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          intent_id?: string | null
          merchant_id: string
          agent_id: string
          amount: number
          currency?: string
          status?: 'PROPOSED' | 'EVALUATING' | 'APPROVED' | 'BLOCKED' | 'PENDING_REVIEW' | 'REJECTED' | 'EXECUTING' | 'EXECUTED' | 'FAILED' | 'SETTLED' | 'RECONCILED' | 'CANCELLED'
          idempotency_key?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          intent_id?: string | null
          merchant_id?: string
          agent_id?: string
          amount?: number
          currency?: string
          status?: 'PROPOSED' | 'EVALUATING' | 'APPROVED' | 'BLOCKED' | 'PENDING_REVIEW' | 'REJECTED' | 'EXECUTING' | 'EXECUTED' | 'FAILED' | 'SETTLED' | 'RECONCILED' | 'CANCELLED'
          idempotency_key?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      audit_events: {
        Row: {
          id: string
          merchant_id: string
          entity_type: string
          entity_id: string
          transaction_id: string | null
          event_type: string
          actor_type: string
          actor_id: string | null
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          merchant_id: string
          entity_type: string
          entity_id: string
          transaction_id?: string | null
          event_type: string
          actor_type: string
          actor_id?: string | null
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          merchant_id?: string
          entity_type?: string
          entity_id?: string
          transaction_id?: string | null
          event_type?: string
          actor_type?: string
          actor_id?: string | null
          metadata?: Json
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      transaction_status: 'PROPOSED' | 'EVALUATING' | 'APPROVED' | 'BLOCKED' | 'PENDING_REVIEW' | 'REJECTED' | 'EXECUTING' | 'EXECUTED' | 'FAILED' | 'SETTLED' | 'RECONCILED' | 'CANCELLED'
      guardrail_decision_result: 'PERMIT' | 'BLOCK' | 'REVIEW'
      risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
      policy_category: 'MARGIN' | 'SPEND' | 'RISK' | 'VELOCITY' | 'DISCOUNT'
      human_review_status: 'PENDING' | 'APPROVED' | 'REJECTED'
    }
  }
}

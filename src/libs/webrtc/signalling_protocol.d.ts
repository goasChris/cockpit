// This file was generated by [ts-rs](https://github.com/Aleph-Alpha/ts-rs) during `cargo build` step. Do not edit this file manually.
/* eslint-disable jsdoc/require-jsdoc */

export type Message =
  | {
      type: 'question'
      content: Question
    }
  | {
      type: 'answer'
      content: Answer
    }
  | {
      type: 'negotiation'
      content: Negotiation
    }

export type Answer =
  | {
      type: 'peerId'
      content: PeerIdAnswer
    }
  | {
      type: 'availableStreams'
      content: Array<Stream>
    }
  | {
      type: 'startSession'
      content: BindAnswer
    }

export type Question =
  | {
      type: 'peerId'
    }
  | {
      type: 'availableStreams'
    }
  | {
      type: 'startSession'
      content: BindOffer
    }
  | {
      type: 'endSession'
      content: EndSessionQuestion
    }

export type Negotiation =
  | {
      type: 'mediaNegotiation'
      content: MediaNegotiation
    }
  | {
      type: 'iceNegotiation'
      content: IceNegotiation
    }

export interface BindOffer {
  consumer_id: string
  producer_id: string
}

export interface BindAnswer {
  consumer_id: string
  producer_id: string
  session_id: string
}

export interface PeerIdAnswer {
  id: string
}

export interface Stream {
  id: string
  name: string
  encode: string | null
  height: number | null
  width: number | null
  interval: string | null
  source: string | null
  created: string | null
}

export interface IceNegotiation {
  consumer_id: string
  producer_id: string
  session_id: string
  ice: RTCIceCandidateInit
}

export interface MediaNegotiation {
  consumer_id: string
  producer_id: string
  session_id: string
  sdp: RTCSessionDescription
}

export interface EndSessionQuestion {
  consumer_id: string
  producer_id: string
  session_id: string
  reason: string
}
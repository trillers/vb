var MessageDefinitions = {
    am: {
        /**
         * Message routing: am ---> node
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      NodeId: String
         *      Remark: String
         *  }
         */
        heartbeat: {
            eventName: 'heartbeat-am',
            queueName: 'heartbeat-am',
            queueOptions: {durable: false},
            produceOptions: {persistent: false},
            consumeOptions: {noAck: true}
        },

        /**
         * Message routing: am ---> node
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      NodeId: String
         *      RAM: String
         *      CPU: String
         *      ExceptedAgentSum: 预计
         *      ActualAgentSum: 实际
         *  }
         */
        infoResponse: {
            eventName: 'info-response',
            queueName: 'info-response-am',
            ackDelay: false,
            queueOptions: {durable: true},
            produceOptions: {persistent: true},
            consumeOptions: {noAck: false}
        },

        /**
         * Message routing: am ---> node
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      NodeId: String
         *      OldStatus: String  reference: 'started' | 'stopped' | 'interrupted'
         *      NewStatus: String
         *      ExceptedAgentSum: 预计
         *      ActualAgentSum: 实际
         *  }
         */
        statusChange: {
            eventName: 'status-change-am',
            queueName: 'status-change-am-node',
            ackDelay: false,
            queueOptions: {durable: true},
            produceOptions: {persistent: true},
            consumeOptions: {noAck: false}
        }
    },

    node: {
        /**
         * Message routing: node ---> am
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      NodeId: String
         *  }
         */
        infoRequest: {
            eventName: 'info-request-',
            queueName: 'info-request-node-',
            ackDelay: false,
            queueOptions: {durable: false},
            produceOptions: {persistent: false},
            consumeOptions: {noAck: false}
        },

        /**
         *  Message routing: node ---> am
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      NodeId: String
         *      AgentId: String
         *      Command: 'start'
         *      Intention: String 'register' | 'login'
         *      Mode: 'trusted' | 'untrusted'
         *      Nickname: String  ONLY applicable if Mode is untrusted
         *      Sex: 0 1 2        ONLY applicable if Mode is untrusted
         *      Region:           ONLY applicable if Mode is untrusted
         *  }
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      NodeId: String
         *      AgentId: String
         *      Command: 'stop'
         *      Mode: 'graceful' | 'ungraceful'
         *          graceful means stop until all action messages,
         *          ungraceful means stop it right now whatever unhandled action messages there.
         *  }
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      NodeId: String
         *      AgentId: String
         *      Command: 'reload'
         *      Mode: 'graceful' | 'ungraceful'
         *          graceful means reload until all action messages,
         *          ungraceful means reload it right now whatever unhandled action messages there.
         *  }
         *
         */
        command: {
            eventName: 'command-',
            queueName: 'command-node-',
            ackDelay: false,
            queueOptions: {durable: true},
            produceOptions: {persistent: true},
            consumeOptions: {noAck: false}
        }
    },

    agent: {
        /**
         * Message routing: agent ---> node
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      NodeId: String
         *      AgentId: String
         *      AgentStatus:
         *       - starting
         *       - logging
         *       - mislogged
         *       - logged
         *       - exceptional
         *       - aborted
         *       - exited
         *  }
         */
        heartbeat: {
            eventName: 'heartbeat-agent',
            queueName: 'heartbeat-agent',
            queueOptions: {durable: false},
            produceOptions: {persistent: false},
            consumeOptions: {noAck: true}
        },

        /**
         * Message routing: agent ---> node
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      AgentId: String
         *      OldStatus: String
         *         reference:
         *       - starting
         *       - logging
         *       - mislogged
         *       - logged
         *       - exceptional
         *       - aborted
         *       - exited
         *      NewStatus: String
         *  }
         */
        agentStatusChange: {
            eventName: 'status-change-agent',
            queueName: 'status-change-agent-node',
            ackDelay: false,
            queueOptions: {durable: true},
            produceOptions: {persistent: true},
            consumeOptions: {noAck: false}
        },

        /**
         * Message routing: agent ---> bot
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      AgentId: String
         *      OldStatus: String
         *         reference:
         *       - starting
         *       - logging
         *       - mislogged
         *       - logged
         *       - exceptional
         *       - aborted
         *       - exited
         *      NewStatus: String
         *  }
         */
        botStatusChange: {
            eventName: 'status-change',
            queueName: 'status-change-agent-bot',
            ackDelay: false,
            queueOptions: {durable: true},
            produceOptions: {persistent: true},
            consumeOptions: {noAck: false}
        },

        /**
         *  Message routing: agent ---> bot
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      Action: 'profile-response' reference action definitions
         *      AgentId: String
         *      OriginalHeadImgUrl: original head image url when we request profile
         *      HeadImgId: ?
         *      Nickname: String
         *      Sex: 0 1 2
         *      Region:
         *  }
         *
         *  TODO: coming soon
         *
         *
         *
         *
         */
        actionIn: {
            eventName: 'action-in',
            queueName: 'action-in',
            ackDelay: false,
            queueOptions: {durable: true},
            produceOptions: {persistent: true},
            consumeOptions: {noAck: false}
        },

        /**
         *  Message routing: agent ---> bot
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      Action: String, reference action definitions
         *      AgentId: String
         *      Took: milliseconds it took to execute the action
         *      Code: String reference code definitions
         *      Desc: String
         *  }
         */
        actionFeedback: {
            eventName: 'action-feedback',
            queueName: 'action-feedback',
            ackDelay: false,
            queueOptions: {durable: true},
            produceOptions: {persistent: true},
            consumeOptions: {noAck: false}
        },
        /**
         * * Message routing: am ---> node
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      Command: String, reference action definitions
         *      AgentId: String
         *      Took: milliseconds it took to execute the action
         *      Code: String reference code definitions
         *      Desc: String
         *
         */
        commandFeedback: {
            eventName: 'command-feedback',
            queueName: 'command-feedback-agent',
            ackDelay: false,
            queueOptions: {durable: true},
            produceOptions: {persistent: true},
            consumeOptions: {noAck: false}
        }
    },


    bot: {

        /**
         *  Message routing: bot ---> node ( ---> am)
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      AgentId: String
         *      Command: 'start'
         *      Intention: String 'register' | 'login'
         *      Mode: 'trusted' | 'untrusted'
         *      Nickname: String  ONLY applicable if Mode is untrusted
         *      Sex: 0 1 2        ONLY applicable if Mode is untrusted
         *      Region:           ONLY applicable if Mode is untrusted
         *  }
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      AgentId: String
         *      Command: 'stop'
         *      Mode: 'graceful' | 'ungraceful'
         *          graceful means stop until all action messages,
         *          ungraceful means stop it right now whatever unhandled action messages there.
         *  }
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      AgentId: String
         *      Command: 'reload'
         *      Mode: 'graceful' | 'ungraceful'
         *          graceful means reload until all action messages,
         *          ungraceful means reload it right now whatever unhandled action messages there.
         *  }
         *
         */
        command: {
            eventName: 'command',
            queueName: 'command-bot',
            ackDelay: false,
            queueOptions: {durable: true},
            produceOptions: {persistent: true},
            consumeOptions: {noAck: false}
        },

        /**
         *  Message routing: bot ---> agent
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      Action: 'profile-request' reference action definitions
         *      AgentId: String
         *  }
         *
         *  TODO: coming soon
         *
         *
         *
         *
         *
         */
        actionOut: {
            eventName: 'action-out-',
            queueName: 'action-out-',
            ackDelay: true,
            queueOptions: {durable: true},
            produceOptions: {persistent: true},
            consumeOptions: {noAck: false}
        },

        /**
         *  Message routing: bot ---> vk
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      Action: 'profile-request' reference action definitions
         *      AgentId: String
         *  }
         *
         *  TODO: coming soon
         *
         *
         *
         *
         *
         */
        clientActionIn: {
            eventName: 'client-action-in-',
            queueName: 'client-action-in-',
            queueOptions: {durable: true},
            produceOptions: {persistent: true},
            consumeOptions: {noAck: false}
        },

        clientAgentStatusChange: {
            eventName: 'client-agent-status-change-',
            queueName: 'client-agent-status-change-',
            queueOptions: {durable: true},
            produceOptions: {persistent: true},
            consumeOptions: {noAck: false}
        },

        /**
         *  Message routing: bot ---> vk
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      Action: String, reference action definitions
         *      AgentId: String
         *      Took: milliseconds it took to execute the action
         *      Code: String reference code definitions
         *      Desc: String
         *  }
         */
        clientActionFeedback: {
            eventName: 'client-action-feedback-',
            queueName: 'client-action-feedback-',
            queueOptions: {durable: true},
            produceOptions: {persistent: true},
            consumeOptions: {noAck: false}
        }
    },

    client: {
        /**
         *  Message routing: vk ---> bot ( ---> node ----->am)
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      AgentId: String
         *      Command: 'start'
         *      Intention: String 'register' | 'login'
         *      Mode: 'trusted' | 'untrusted'
         *      Nickname: String  ONLY applicable if Mode is untrusted
         *      Sex: 0 1 2        ONLY applicable if Mode is untrusted
         *      Region:           ONLY applicable if Mode is untrusted
         *  }
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      AgentId: String
         *      Command: 'stop'
         *      Mode: 'graceful' | 'ungraceful'
         *          graceful means stop until all action messages,
         *          ungraceful means stop it right now whatever unhandled action messages there.
         *  }
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      AgentId: String
         *      Command: 'reload'
         *      Mode: 'graceful' | 'ungraceful'
         *          graceful means reload until all action messages,
         *          ungraceful means reload it right now whatever unhandled action messages there.
         *  }
         *
         */
        command: {
            eventName: 'command-vk',
            queueName: 'command-vk',
            queueOptions: {durable: true},
            produceOptions: {persistent: true},
            consumeOptions: {noAck: false}
        },
        /**
         *  Message routing: vk ---> bot (----->agent)
         *
         *  msg: {
         *      CreateTime: Number: Date#getTime() milliseconds
         *      Action: 'profile-request' reference action definitions
         *      AgentId: String
         *  }
         *
         *  TODO: coming soon
         *
         *
         *
         *
         *
         */
        actionOut: {
            eventName: 'client-action-out',
            queueName: 'client-action-out',
            ackDelay: false,
            queueOptions: {durable: true},
            produceOptions: {persistent: true},
            consumeOptions: {noAck: false}
        }
    }
};

module.exports = MessageDefinitions;
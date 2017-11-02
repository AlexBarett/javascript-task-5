'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        subscriptions: {},

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (this.subscriptions[event]) {
                this.subscriptions[event].push({ person: context, func: handler });
            } else {
                this.subscriptions[event] = [{ person: context, func: handler }];
            }

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            var newSubscriptions = this.subscriptions;
            if (typeof this.subscriptions[event] !== 'undefined') {
                Object.keys(newSubscriptions).forEach(function (events) {
                    if (events === event || events.includes(event + '.')) {
                        newSubscriptions[events] = newSubscriptions[events]
                            .filter(student => student.person !== context);
                    }
                });
            }

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            var newSubscriptions = this.subscriptions;
            var allCurrentEvents = event.split('.').reduce(function (events, element) {
                if (events.length === 0) {
                    events.push(element);

                    return events;
                }
                events.push(events[events.length - 1] + '.' + element);

                return events;
            }, [])
                .reverse();
            allCurrentEvents.forEach(function (currentEvent) {
                if (newSubscriptions[currentEvent]) {
                    newSubscriptions[currentEvent].forEach(function (student) {
                        student.func.call(student.person);
                    });
                }
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = true;
module.exports = getEmitter;

function addEvent(event, subscriptions, student) {
    if (subscriptions[event]) {
        subscriptions[event].push(student);
    } else {
        subscriptions[event] = [student];
    }
}

function applyEvent(student) {
    if (student.step !== student.every) {
        student.step ++;

        return student;
    }
    if (student.repeat !== 0) {
        student.func.call(student.person);
        student.repeat --;
        student.step = 1;
    }

    return student;
}

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
            let person = {
                person: context,
                func: handler,
                step: 1,
                repeat: Infinity,
                every: 1
            };
            addEvent(event, this.subscriptions, person);

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
                    newSubscriptions[currentEvent].map(function (student) {
                        student = applyEvent(student);

                        return student;
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
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            if (times <= 0) {
                let person = {
                    person: context,
                    func: handler,
                    step: 1,
                    repeat: Infinity,
                    every: 1
                };
                addEvent(event, this.subscriptions, person);
            } else {
                let person = {
                    person: context,
                    func: handler,
                    step: 1,
                    repeat: times,
                    every: 1
                };
                addEvent(event, this.subscriptions, person);
            }

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            if (frequency <= 0) {
                let person = {
                    person: context,
                    func: handler,
                    step: 1,
                    repeat: Infinity,
                    every: 1
                };
                addEvent(event, this.subscriptions, person);
            } else {
                let person = {
                    person: context,
                    func: handler,
                    step: frequency,
                    repeat: Infinity,
                    every: frequency
                };
                addEvent(event, this.subscriptions, person);
            }

            return this;
        }
    };
}

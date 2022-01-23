const aliases = (prefix = `src`) => ({
    '@components': `${prefix}/components`,
    '@config': `${prefix}/config`,
    '@data': `${prefix}/data`,
    '@hooks': `${prefix}/hooks`,
    '@icons': `${prefix}/components/atoms/Icons`,
    '@styles': `${prefix}/styles`,
    '@utils': `${prefix}/utils`,
    '@state': `${prefix}/state`,
    '@types': `${prefix}/types`,
  });

  module.exports = aliases;

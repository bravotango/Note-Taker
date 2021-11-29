// Custom middleware that logs out the type and path of each request to the server
const colorLog = (req, res, next) => {
  const fgBlue = '\033[34m';
  const fgCyan = '\x1b[36m';
  const fgMagenta = '\033[35m';

  const fgYellow = '\033[33m';

  const message = (color) => `${color}${req.method} request to ${req.path}`;

  switch (req.method) {
    case 'GET': {
      console.info('📭 ' + message(fgMagenta) + ' 🟢');
      break;
    }
    case 'POST': {
      console.info('📫 ' + message(fgBlue) + ' 🔵');
      break;
    }
    case 'DELETE': {
      console.info('❌ ' + message(fgCyan) + ' 🔴');
      break;
    }
    default:
      console.log('🟡 ' + message(fgYellow) + ' 🟡');
  }
  next();
};

exports.colorLog = colorLog;

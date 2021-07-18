import path from 'path';
import _ from 'lodash';

const safeVariableName = (fileName) => {
  const indexOfDot = fileName.indexOf('.');

  if (indexOfDot === -1) {
    return fileName;
  } else {
    return fileName.slice(0, indexOfDot);
  }
};

const buildImportBlock = (files) => {
  let importBlock;

  importBlock = _.map(files, (fileName) => {
    return (
      'import ' + safeVariableName(fileName) + ' from \'./' + fileName + '\';'
    );
  });

  importBlock = importBlock.join('\n');

  return importBlock;
};

const buildExportBlock = (files, directoryPath = '') => {
  let exportBlock = '';
  let defaultExportBlock = '';
  const directoryName = path.dirname(directoryPath);

  // exportBlock += "export ";
  exportBlock += '{ ';
  defaultExportBlock += '{ ';

  exportBlock += _.map(files, (fileName) => {
    return safeVariableName(fileName);
  }).join(', ');

  defaultExportBlock += _.map(files, (fileName) => {
    if (fileName === directoryName) {
      return '...' + safeVariableName();
    } else {
      return safeVariableName(fileName);
    }
  }).join(', ');

  exportBlock += ' }';
  defaultExportBlock += ' }';

  return 'export ' + exportBlock + ';\n' +
  'export default ' + defaultExportBlock + ';';
};

export default (filePaths, options = {}, directoryPath) => {
  let code;
  let configCode;

  code = '';
  configCode = '';

  if (options.banner) {
    const banners = _.isArray(options.banner) ?
      options.banner :
      [options.banner];

    banners.forEach((banner) => {
      code += banner + '\n';
    });

    code += '\n';
  }

  if (options.config && _.size(options.config) > 0) {
    configCode += ' ' + JSON.stringify(options.config);
  }

  code += '// @create-index' + configCode + '\n\n';

  if (filePaths.length) {
    const sortedFilePaths = filePaths.sort();

    code += buildImportBlock(sortedFilePaths);
    code += '\n\n';
    code += buildExportBlock(sortedFilePaths, directoryPath);
    code += '\n\n';
  }

  return code;
};

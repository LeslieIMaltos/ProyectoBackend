import { v2 } from 'cloudinary';
import { CLOUDINARY } from './constants';
export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (): any => {
    return v2.config({
      cloud_name: 'dtwqhdbkk',
      api_key: '425886869185168',
      api_secret: 'C3zarz3w6LDUbn-eU7myaAUXfFk',
    });
  },
};

import GroundEnemy from '../entities/enemies/GroundEnemy.js';
import FlyingEnemy from '../entities/enemies/FlyingEnemy.js';

export default class EnemyFactory {
    static create(type, options) {
        switch (type) {
            case 'ground':
                return new GroundEnemy(options);
            case 'flying':
                return new FlyingEnemy(options);
            default:
                return new GroundEnemy(options);
        }
    }
}

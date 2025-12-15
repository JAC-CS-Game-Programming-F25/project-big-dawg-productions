import GroundEnemy from '../entities/enemies/GroundEnemy.js';
import FlyingEnemy from '../entities/enemies/FlyingEnemy.js';
import EnemyType from '../enums/EnemyType.js';

export default class EnemyFactory {
    static create(type, options) {
        switch (type) {
            case EnemyType.Ground:
                return new GroundEnemy(options);
            case EnemyType.Flying:
                return new FlyingEnemy(options);
            default:
                return new GroundEnemy(options);
        }
    }
}

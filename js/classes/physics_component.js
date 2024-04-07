/**
 * A physics component for an entity.
 * 
 * The physics component is responsible for handling the physics of an entity.
 * It stores the mass, velocity, and acceleration of the entity.
 * 
 * ## How to use:
 * - Call updateMovement() in the entity's update() method, after applying all forces and drag.
 * - Call applyForce(PhysicsComponent.GRAVITY) to apply gravity.
 * - Call applyDrag(PhysicsComponent.AIR_RESISTANCE) to apply air resistance when in the air.
 * - Call applyDrag(friction) to apply friction when standing on a block.
 * 
 * @author Nathan Hinthorne
 */
class PhysicsComponent {
    /**
     * Constructor for the physics component.
     * The entity must have a `pos` field.
     * 
     * @param {number} mass The mass of the entity. 
     */
    constructor(mass) {
        this.mass = mass;
        this.velocity = new Vector(0, 0);
        this.acceleration = new Vector(0, 0);
        this.netForce = new Vector(0, 0);

        this.constantForces = [];
    }

    /**
     * Use the current net force to update the entity's movement.
     */
    updateMovement() {
        // Factor in any constant forces
        for (let i = 0; i < this.constantForces.length; i++) {
            this.constantForces[i].duration -= GAME.clockTick;
            
            if (this.constantForces[i].duration > 0) {
                this.applyForce(this.constantForces[i].force);
            } else {
                // remove the current force
                this.constantForces.splice(i, 1);
                i--; // adjust the index due to the removal
            }
        }

        // Update acceleration based on net force
        // Newton's second law: F = ma  =>  a = F / m
        const unsyncedAcceleration = Vector.divide(this.netForce, this.mass);
        const syncedAcceleration = Vector.multiply(unsyncedAcceleration, GAME.clockTick);
        this.acceleration = syncedAcceleration;

        // Update velocity based on acceleration
        const unsyncedVelocity = Vector.add(this.velocity, this.acceleration);
        const syncedVelocity = Vector.multiply(unsyncedVelocity, GAME.clockTick);
        this.velocity = syncedVelocity;
        this.acceleration = new Vector(0, 0); // Reset acceleration

        // Ensure the entity doesn't exceed terminal velocity
        if (this.velocity.y > PhysicsComponent.TERMINAL_Y_VELOCITY) {
            this.velocity = new Vector(this.velocity.x, PhysicsComponent.TERMINAL_Y_VELOCITY);
        }

        // Finally, update the position based on velocity
        const unsyncedPos = Vector.add(this.pos, this.velocity);
        const syncedPos = Vector.multiply(unsyncedPos, GAME.clockTick);
        this.pos = syncedPos;
    }

    /**
     * Apply a force to the entity, factoring it into the net force.
     * 
     * Use PhysicsComponent.GRAVITY for gravity.
     * 
     * @param {Vector} force The force to apply.
     */
    applyForce(force) {
        this.netForce = Vector.add(this.netForce, force);
    }

    /**
     * Apply a constant force to the entity for a certain duration.
     * 
     * @param {Vector} force The force to apply.
     * @param {number} duration The duration (in seconds) to apply the force for.
     */
    applyConstantForce(force, duration) {
        this.constantForces.push({force, duration});
    }

    /**
     * Apply drag to the entity.
     * 
     * - For air resistance, call whenever in the air. 
     *   - (Use PhysicsComponent.AIR_RESISTANCE).
     * 
     * - For friction, call whenever standing on block. 
     *   - (Use current block's friction property).
     * 
     * @param {number} dragCoefficient The drag coefficient to apply.
     */
    applyDrag(dragCoefficient) {
        const dragForce = Vector.multiply(this.velocity, -dragCoefficient);
        this.applyForce(dragForce);
    }


    /** 
     * Gravity acceleration in pixels/seconds^2
     */
    static get GRAVITY() {
        return new Vector(0, 0.3);
    }

    /**
     * Air resistance coefficient
     */
    static get AIR_RESISTANCE() {
        return 0.1;
    }

    /**
     * Terminal velocity in pixels/second
     */
    static get TERMINAL_Y_VELOCITY() {
        return 10;
    }
}
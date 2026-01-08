import type { Employee } from './employees.data';
import baseEmployees from '@/data/employees.base.json';

const STORAGE_KEY = 'itw-employees';

class EmployeeService {
    /** Inicializa desde JSON base si no existe data */
    init() {
        const exists = localStorage.getItem(STORAGE_KEY);
        if (!exists) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(baseEmployees));
            console.log('[EmployeeService] Inicializado desde JSON base');
        }
    }

    /** Obtener todos */
    getAll(): Employee[] {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    }

    /** Guardar */
    private save(employees: Employee[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
        console.log('[EmployeeService] Guardado', employees);
    }

    /** Crear empleado */
    add(data: Omit<Employee, 'id'>) {
        const employees = this.getAll();

        const newEmployee: Employee = {
            id: Date.now(),
            mustChangePassword: false,
            ...data,
        };

        employees.push(newEmployee);
        this.save(employees);

        console.log('[EmployeeService] Nuevo empleado', newEmployee);
        return newEmployee;
    }

    /** Eliminar */
    delete(id: number) {
        const employees = this.getAll().filter((e) => e.id !== id);
        this.save(employees);
    }

    /** Actualizar */
    update(id: number, data: Partial<Employee>) {
        const employees = this.getAll().map((emp) => (emp.id === id ? { ...emp, ...data } : emp));
        this.save(employees);
    }

    /** 🔐 Asignar contraseña temporal */
    setTemporaryPassword(id: number, tempPassword: string) {
        const employees = this.getAll().map((emp) =>
            emp.id === id
                ? {
                      ...emp,
                      password: tempPassword,
                      mustChangePassword: true,
                  }
                : emp
        );

        this.save(employees);

        console.log('[EmployeeService] Password temporal asignado', {
            id,
            tempPassword,
        });
    }
}

export const employeeService = new EmployeeService();

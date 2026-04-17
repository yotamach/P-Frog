import { render, screen } from '@testing-library/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableRow,
  TableHead,
  TableCell,
  TableCaption
} from './table';

describe('Table Components', () => {
  describe('Table', () => {
    it('should render table element', () => {
      const { container } = render(
        <Table>
          <tbody>
            <tr>
              <td>Test</td>
            </tr>
          </tbody>
        </Table>
      );

      expect(container.querySelector('table')).toBeTruthy();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <Table className="custom-class">
          <tbody>
            <tr>
              <td>Test</td>
            </tr>
          </tbody>
        </Table>
      );

      const table = container.querySelector('table');
      expect(table).toHaveClass('custom-class');
    });

    it('should have wrapper div with overflow-auto', () => {
      const { container } = render(<Table><tbody /></Table>);
      const wrapper = container.firstChild as HTMLElement;

      expect(wrapper.tagName).toBe('DIV');
      expect(wrapper).toHaveClass('overflow-auto');
    });
  });

  describe('TableHeader', () => {
    it('should render thead element', () => {
      const { container } = render(
        <table>
          <TableHeader>
            <tr>
              <th>Header</th>
            </tr>
          </TableHeader>
        </table>
      );

      expect(container.querySelector('thead')).toBeTruthy();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <table>
          <TableHeader className="custom-header">
            <tr>
              <th>Header</th>
            </tr>
          </TableHeader>
        </table>
      );

      const thead = container.querySelector('thead');
      expect(thead).toHaveClass('custom-header');
    });
  });

  describe('TableBody', () => {
    it('should render tbody element', () => {
      const { container } = render(
        <table>
          <TableBody>
            <tr>
              <td>Body</td>
            </tr>
          </TableBody>
        </table>
      );

      expect(container.querySelector('tbody')).toBeTruthy();
    });

    it('should apply custom className', () => {
      const { container } = render(
        <table>
          <TableBody className="custom-body">
            <tr>
              <td>Body</td>
            </tr>
          </TableBody>
        </table>
      );

      const tbody = container.querySelector('tbody');
      expect(tbody).toHaveClass('custom-body');
    });
  });

  describe('TableFooter', () => {
    it('should render tfoot element', () => {
      const { container } = render(
        <table>
          <TableFooter>
            <tr>
              <td>Footer</td>
            </tr>
          </TableFooter>
        </table>
      );

      expect(container.querySelector('tfoot')).toBeTruthy();
    });

    it('should have border and background classes', () => {
      const { container } = render(
        <table>
          <TableFooter>
            <tr>
              <td>Footer</td>
            </tr>
          </TableFooter>
        </table>
      );

      const tfoot = container.querySelector('tfoot');
      expect(tfoot).toHaveClass('border-t');
    });
  });

  describe('TableRow', () => {
    it('should render tr element', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow>
              <td>Row</td>
            </TableRow>
          </tbody>
        </table>
      );

      expect(container.querySelector('tr')).toBeTruthy();
    });

    it('should have hover and border classes', () => {
      const { container } = render(
        <table>
          <tbody>
            <TableRow>
              <td>Row</td>
            </TableRow>
          </tbody>
        </table>
      );

      const tr = container.querySelector('tr');
      expect(tr).toHaveClass('border-b');
      expect(tr).toHaveClass('transition-colors');
    });
  });

  describe('TableHead', () => {
    it('should render th element', () => {
      const { container } = render(
        <table>
          <thead>
            <tr>
              <TableHead>Header Cell</TableHead>
            </tr>
          </thead>
        </table>
      );

      expect(container.querySelector('th')).toBeTruthy();
      expect(screen.getByText('Header Cell')).toBeTruthy();
    });

    it('should have correct text alignment and padding', () => {
      const { container } = render(
        <table>
          <thead>
            <tr>
              <TableHead>Header</TableHead>
            </tr>
          </thead>
        </table>
      );

      const th = container.querySelector('th');
      expect(th).toHaveClass('text-left');
      expect(th).toHaveClass('px-2');
    });
  });

  describe('TableCell', () => {
    it('should render td element', () => {
      const { container } = render(
        <table>
          <tbody>
            <tr>
              <TableCell>Cell Content</TableCell>
            </tr>
          </tbody>
        </table>
      );

      expect(container.querySelector('td')).toBeTruthy();
      expect(screen.getByText('Cell Content')).toBeTruthy();
    });

    it('should have correct padding', () => {
      const { container } = render(
        <table>
          <tbody>
            <tr>
              <TableCell>Cell</TableCell>
            </tr>
          </tbody>
        </table>
      );

      const td = container.querySelector('td');
      expect(td).toHaveClass('p-2');
    });
  });

  describe('TableCaption', () => {
    it('should render caption element', () => {
      const { container } = render(
        <table>
          <TableCaption>Table Caption</TableCaption>
          <tbody>
            <tr>
              <td>Cell</td>
            </tr>
          </tbody>
        </table>
      );

      expect(container.querySelector('caption')).toBeTruthy();
      expect(screen.getByText('Table Caption')).toBeTruthy();
    });
  });

  describe('Table Integration', () => {
    it('should render complete table structure', () => {
      render(
        <Table>
          <TableCaption>Test Table</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Age</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>John</TableCell>
              <TableCell>30</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Jane</TableCell>
              <TableCell>25</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Total: 2 users</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      );

      expect(screen.getByText('Test Table')).toBeTruthy();
      expect(screen.getByText('Name')).toBeTruthy();
      expect(screen.getByText('Age')).toBeTruthy();
      expect(screen.getByText('John')).toBeTruthy();
      expect(screen.getByText('Jane')).toBeTruthy();
      expect(screen.getByText('Total: 2 users')).toBeTruthy();
    });
  });
});

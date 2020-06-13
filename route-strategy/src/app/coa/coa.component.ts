import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'coa.component.html',
  styles: [
    `
      .container {
      }
      .treeContainer {
      }
      .outletContainer {
      }
    `,
  ],
})
export class CoaComponent implements OnInit {
  nodes = [
    {
      id: 1,
      type: 0,
      name: 'ساختار حسایها',
      children: [
        {
          id: 2,
          type: 1,
          name: 'گروه 1',
          children: [
            {
              id: 4,
              type: 2,
              name: 'کل 1',
              children: [
                { id: 41, type: 3, name: 'معین 1' },
                { id: 51, type: 3, name: 'معین 2' },
              ],
            },
            {
              id: 5,
              type: 2,
              name: 'کل 2',
              children: [
                { id: 42, type: 3, name: 'معین 1' },
                { id: 52, type: 3, name: 'معین 2' },
              ],
            },
          ],
        },
        {
          id: 3,
          type: 1,
          name: 'گروه 2',
          children: [
            { id: 6, type: 2, name: 'کل 1' },
            { id: 7, type: 2, name: 'کل 2' },
          ],
        },
      ],
    },
  ];
  options = {
    rtl: true,
  };
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {}

  nodeActivate(event) {
    const data = event.node.data;
    let routePath = '';
    switch (data.type) {
      case 1:
        routePath = 'account-group';
        break;
      case 2:
        routePath = 'gl';
        break;
      case 3:
        routePath = 'sl';
        break;
      default:
        break;
    }

    this.router.navigate([`./${routePath}`], {
      relativeTo: this.route,
    });
  }
}

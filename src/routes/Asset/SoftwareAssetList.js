import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Link } from 'dva/router';
import styles from './SoftwareAssetList.less';

const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');
const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新建规则"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
        {form.getFieldDecorator('desc', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ softwareAsset, loading }) => ({
  softwareAsset,
  loading: loading.models.softwareAsset,
}))
@Form.create()
export default class SoftwareAssetList extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'softwareAsset/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'softwareAsset/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    console.log(form.getFieldsValue())
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'softwareAsset/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'softwareAsset/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Asset Id">
              {getFieldDecorator('assetId')(<Input placeholder="please input" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Asset Name">
              {getFieldDecorator('assetName')(<Input placeholder="please input" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                Query
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                Reset
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Asset Id">
              {getFieldDecorator('assetId')(<Input placeholder="please input" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Asset Name">
              {getFieldDecorator('assetName')(<Input placeholder="please input" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Bu Org">
              {getFieldDecorator('buId')(
                <Select placeholder="please choose" style={{ width: '100%' }}>
                  <Option value="it">IT</Option>
                  <Option value="admin">Admin</Option>
                  <Option value="eqst">EQST</Option>
                  <Option value="mas">FI</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="User Name">
              {getFieldDecorator('userName')(<Input placeholder="please input" />)}
            </FormItem>
          </Col>
          <Col md={16} sm={48}>
            <FormItem label="Prod Date">
              {getFieldDecorator('prodStartDate')(
                <DatePicker style={{ width: '30%' }} placeholder="Please choose start date" />
              )}
              {getFieldDecorator('prodEndDate')(
                <DatePicker style={{ width: '30%' }} placeholder="Please choose end date" />
              )}
            </FormItem>

          </Col>
        </Row>

        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="Life Cycle Phase">
              {getFieldDecorator('lifeCyclePhase')(
                <Select placeholder="please choose" style={{ width: '100%' }}>
                  <Option value="it">IT</Option>
                  <Option value="admin">Admin</Option>
                  <Option value="eqst">EQST</Option>
                  <Option value="mas">FI</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="SDLC Phase">
              {getFieldDecorator('sdlcPhase')(
                <Select placeholder="please choose" style={{ width: '100%' }}>
                  <Option value="it">IT</Option>
                  <Option value="admin">Admin</Option>
                  <Option value="eqst">EQST</Option>
                  <Option value="mas">FI</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
          </Col>
        </Row>

        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              Query
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              Reset
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      softwareAsset: { data },
      loading,
    } = this.props;

    const { selectedRows, modalVisible } = this.state;

    const columns = [
      {
        title: 'Asset Name',
        dataIndex: 'assetId',
      },
      {
        title: 'Asset Sub Cls',
        dataIndex: 'assetSubCls',
      },
      {
        title: 'Asset Name',
        dataIndex: 'assetName',
      },
      {
        title: 'Vendor Name',
        dataIndex: 'vendorName',
      },
      {
        title: 'Primary Tech Owner',
        dataIndex: 'primaryTechOwner',
      },
      {
        title: 'Actual Cost',
        dataIndex: 'actualCost',
      },
      {
        title: 'Action',
        render: () => (
          <Fragment>
            <a href="">Detail</a>
            <Divider type="vertical" />
            <a href="">Edit</a>
            <Divider type="vertical" />
            <a href="">Clone</a>
            <Divider type="vertical" />
            <a href="">Delete</a>
          </Fragment>
        ),
      },
    ];

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    const newSoftwareAssetPath = "/asset/newSoftwareAsset"

    return (
      <PageHeaderLayout title="Software Asset Query">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Link to={newSoftwareAssetPath}>
                <Button icon="plus" type="primary">
                  New Asset
                </Button>
              </Link>

              {selectedRows.length > 0 && (
                <span>
                  <Button>Batch Delete</Button>
                </span>
              )}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
